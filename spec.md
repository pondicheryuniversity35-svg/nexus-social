# Nexus Social

## Current State
- OnboardingPage step 3 has an avatar upload (file picker) that converts image to base64 via FileReader and sets avatarUrl directly
- SettingsPage has a profile picture button that opens a file picker; image is converted to base64 and set as avatarPreview
- Neither flow has any crop or zoom functionality

## Requested Changes (Diff)

### Add
- A reusable `ImageCropModal` component that opens after an image is selected
- The modal shows the selected image with a circular crop overlay
- User can drag the image to reposition it
- User can zoom in/out via a slider
- Confirm button outputs a cropped circular image as a data URL
- Cancel button dismisses modal without changing the current avatar

### Modify
- `OnboardingPage` step 3: after file selection, open `ImageCropModal` instead of setting avatarUrl directly
- `SettingsPage`: after file selection, open `ImageCropModal` instead of setting avatarPreview directly

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/ImageCropModal.tsx`
   - Uses a canvas element to render the image and circular clip
   - Mouse/touch drag to pan the image
   - Slider (range input or shadcn Slider) for zoom (1x to 3x)
   - On confirm: draw cropped result to an offscreen canvas, export as PNG data URL, call onConfirm(dataUrl)
   - Circle crop overlay: darkened outside area with a circular transparent cutout using CSS or canvas composite
   - Uses shadcn Dialog for the modal shell
2. Update `OnboardingPage`: import and use `ImageCropModal`, open it after file selection
3. Update `SettingsPage`: import and use `ImageCropModal`, open it after file selection
