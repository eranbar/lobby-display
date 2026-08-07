# Photo Organization Script

This script automatically organizes photos into folders based on their location and year, extracted from EXIF metadata.

## Features

- **Reads EXIF metadata**: Extracts GPS coordinates and photo dates from image files
- **Reverse geocoding**: Converts GPS coordinates to location names (city/region)
- **Organized structure**: Creates folders as `location/year/` to store photos
- **Multiple formats**: Supports JPG, JPEG, PNG, HEIC, TIFF
- **Copy or move**: Can either copy photos (safe) or move them (saves space)
- **Conflict handling**: Automatically handles filename conflicts with numbering
- **Detailed logging**: Tracks all operations with informative status messages

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Make the script executable (optional):
```bash
chmod +x organize_photos.py
```

## Usage

### Basic Usage (Copy files)

```bash
python organize_photos.py /path/to/source/photos /path/to/destination/organized
```

This will scan the source directory for photos and copy them to the destination organized by location and year.

### Move Files

```bash
python organize_photos.py /path/to/source/photos /path/to/destination/organized --move
```

Use `--move` to move files instead of copying (this saves disk space).

### Custom File Extensions

```bash
python organize_photos.py /path/to/source /path/to/destination --extensions jpg jpeg png
```

Specify which file extensions to process. Default: jpg, jpeg, png, heic, tiff

## Examples

```bash
# Copy photos from Downloads to an organized folder
python organize_photos.py ~/Downloads ~/Pictures/Organized

# Move photos with custom extensions
python organize_photos.py ~/Photos ~/Organized --move --extensions jpg heic

# Recursive search in nested directories
python organize_photos.py ~/Travel ~/Travel_Organized --move
```

## Folder Structure

The script creates a folder structure like:

```
destination/
├── Paris
│   ├── 2023/
│   │   ├── photo1.jpg
│   │   └── photo2.jpg
│   └── 2024/
│       └── photo3.jpg
├── Tokyo
│   ├── 2023/
│   └── 2024/
└── New York
    └── 2024/
```

## Requirements for Metadata

Photos must contain:
- **GPS data**: EXIF GPS coordinates for location extraction
- **Date data**: EXIF DateTime, DateTimeOriginal, or file modification time

Photos without GPS coordinates will be skipped with a warning.

## Troubleshooting

### "No GPS data in photo.jpg"
Photos without GPS coordinates embedded cannot be organized by location. You may need to enable location tracking on your camera/phone.

### Geocoding timeout
If location name lookup is slow, the script uses GPS coordinates as fallback (e.g., `51.23_0.12`).

### Permission denied
Ensure the script has read access to source photos and write access to destination folder.

## Notes

- The script uses OpenStreetMap's Nominatim service for reverse geocoding (location lookups)
- By default, files are copied (safe). Use `--move` to move files instead
- Existing files in destination are handled automatically with numeric suffixes
- All operations are logged to console for transparency
