#!/usr/bin/env python3
"""
Photo organization script that arranges photos into folders by location and year.
Reads GPS coordinates and dates from photo EXIF metadata.
"""

import os
import sys
import shutil
import argparse
import logging
from pathlib import Path
from datetime import datetime
from typing import Optional, Tuple, Dict

from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import piexif
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize geocoder
try:
    geocoder = Nominatim(user_agent="photo_organizer")
except Exception as e:
    logger.warning(f"Failed to initialize geocoder: {e}")
    geocoder = None


def get_exif_data(image_path: Path) -> Optional[Dict]:
    """Extract EXIF data from image."""
    try:
        image = Image.open(image_path)
        exif_data = image._getexif()
        if exif_data:
            return {TAGS.get(tag): value for tag, value in exif_data.items()}
    except Exception as e:
        logger.debug(f"Could not read EXIF from {image_path}: {e}")
    return None


def get_gps_coordinates(exif_data: Dict) -> Optional[Tuple[float, float]]:
    """Extract GPS coordinates from EXIF data."""
    try:
        if "GPSInfo" not in exif_data:
            return None

        gps_info = exif_data["GPSInfo"]
        gps_data = {}
        for tag, value in gps_info.items():
            sub_tag = GPSTAGS.get(tag, tag)
            gps_data[sub_tag] = value

        def convert_to_degrees(value):
            d, m, s = value
            return d + (m / 60.0) + (s / 3600.0)

        lat = convert_to_degrees(gps_data.get("GPSLatitude", [0, 0, 0]))
        lon = convert_to_degrees(gps_data["GPSLongitude"])

        if gps_data.get("GPSLatitudeRef") == "S":
            lat = -lat
        if gps_data.get("GPSLongitudeRef") == "W":
            lon = -lon

        return (lat, lon)
    except Exception as e:
        logger.debug(f"Could not extract GPS coordinates: {e}")
    return None


def get_photo_date(exif_data: Dict, image_path: Path) -> Optional[datetime]:
    """Extract photo date from EXIF data or file modification time."""
    try:
        # Try EXIF DateTime
        if "DateTime" in exif_data:
            date_str = exif_data["DateTime"]
            return datetime.strptime(date_str, "%Y:%m:%d %H:%M:%S")

        # Try DateTimeOriginal
        if "DateTimeOriginal" in exif_data:
            date_str = exif_data["DateTimeOriginal"]
            return datetime.strptime(date_str, "%Y:%m:%d %H:%M:%S")
    except Exception as e:
        logger.debug(f"Could not extract date from EXIF: {e}")

    # Fallback to file modification time
    try:
        mtime = os.path.getmtime(image_path)
        return datetime.fromtimestamp(mtime)
    except Exception as e:
        logger.debug(f"Could not get file modification time: {e}")

    return None


def get_location_name(coordinates: Tuple[float, float]) -> str:
    """Convert GPS coordinates to location name using reverse geocoding."""
    if not geocoder:
        return f"{coordinates[0]:.2f}_{coordinates[1]:.2f}"

    try:
        location = geocoder.reverse(f"{coordinates[0]}, {coordinates[1]}", language="en", timeout=10)
        address = location.address

        # Extract meaningful location (city or country)
        parts = address.split(",")
        if len(parts) >= 3:
            # Usually: street, city, state/country
            return parts[-2].strip()
        return parts[-1].strip() if parts else "Unknown"
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        logger.warning(f"Geocoding failed for {coordinates}: {e}")
        return f"{coordinates[0]:.2f}_{coordinates[1]:.2f}"
    except Exception as e:
        logger.debug(f"Reverse geocoding error: {e}")
        return f"{coordinates[0]:.2f}_{coordinates[1]:.2f}"


def sanitize_folder_name(name: str) -> str:
    """Remove or replace invalid characters for folder names."""
    invalid_chars = r'<>:"/\|?*'
    for char in invalid_chars:
        name = name.replace(char, "_")
    return name.strip()


def organize_photo(image_path: Path, destination_root: Path, move: bool = False) -> bool:
    """
    Organize a single photo into location/year folder structure.

    Args:
        image_path: Path to the photo
        destination_root: Root directory for organized photos
        move: If True, move files; if False, copy files

    Returns:
        True if successfully organized, False otherwise
    """
    # Read EXIF data
    exif_data = get_exif_data(image_path)
    if not exif_data:
        logger.warning(f"No EXIF data found in {image_path.name}")
        return False

    # Get GPS coordinates
    coordinates = get_gps_coordinates(exif_data)
    if not coordinates:
        logger.warning(f"No GPS data in {image_path.name}")
        return False

    # Get location name
    location = get_location_name(coordinates)
    location = sanitize_folder_name(location)

    # Get year
    photo_date = get_photo_date(exif_data, image_path)
    if not photo_date:
        logger.warning(f"No date found in {image_path.name}")
        return False

    year = str(photo_date.year)

    # Create destination folder structure
    dest_folder = destination_root / location / year
    dest_folder.mkdir(parents=True, exist_ok=True)

    # Handle filename conflicts
    dest_file = dest_folder / image_path.name
    if dest_file.exists():
        stem = image_path.stem
        suffix = image_path.suffix
        counter = 1
        while dest_file.exists():
            dest_file = dest_folder / f"{stem}_{counter}{suffix}"
            counter += 1

    # Move or copy file
    try:
        if move:
            shutil.move(str(image_path), str(dest_file))
            logger.info(f"Moved: {image_path.name} → {location}/{year}/")
        else:
            shutil.copy2(str(image_path), str(dest_file))
            logger.info(f"Copied: {image_path.name} → {location}/{year}/")
        return True
    except Exception as e:
        logger.error(f"Failed to organize {image_path.name}: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Organize photos by location and year based on EXIF metadata"
    )
    parser.add_argument(
        "source",
        type=Path,
        help="Source directory containing photos"
    )
    parser.add_argument(
        "destination",
        type=Path,
        help="Destination root directory for organized photos"
    )
    parser.add_argument(
        "--move",
        action="store_true",
        help="Move files instead of copying (default: copy)"
    )
    parser.add_argument(
        "--extensions",
        nargs="+",
        default=[".jpg", ".jpeg", ".png", ".heic", ".tiff"],
        help="File extensions to process (default: jpg jpeg png heic tiff)"
    )

    args = parser.parse_args()

    # Validate paths
    if not args.source.exists():
        logger.error(f"Source directory not found: {args.source}")
        sys.exit(1)

    if not args.source.is_dir():
        logger.error(f"Source is not a directory: {args.source}")
        sys.exit(1)

    # Create destination if it doesn't exist
    args.destination.mkdir(parents=True, exist_ok=True)

    # Normalize extensions
    extensions = [ext.lower() if ext.startswith(".") else f".{ext.lower()}"
                  for ext in args.extensions]

    # Find and organize photos
    photo_files = []
    for ext in extensions:
        photo_files.extend(args.source.glob(f"**/*{ext}"))
        photo_files.extend(args.source.glob(f"**/*{ext.upper()}"))

    if not photo_files:
        logger.warning(f"No photo files found in {args.source}")
        sys.exit(0)

    logger.info(f"Found {len(photo_files)} photo(s) to organize")

    successful = 0
    failed = 0

    for photo_path in photo_files:
        if organize_photo(photo_path, args.destination, args.move):
            successful += 1
        else:
            failed += 1

    logger.info(f"\nOrganization complete!")
    logger.info(f"  Successful: {successful}")
    logger.info(f"  Failed: {failed}")


if __name__ == "__main__":
    main()
