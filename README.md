# BigInt Converter

Extension converts BigInt values by dividing them by a specified factor (10^n). This is particularly useful when working with large numbers that need to be scaled down for readability or processing.

## Features

- **Convert BigInt to Number**: Convert BigInt values to regular numbers by dividing by a specified factor
- **Convert BigInt to BigInt**: Convert BigInt values to smaller BigInt values by dividing by a specified factor
- **Configurable Factor**: Set a default conversion factor (10^n) in settings
- **Interactive Input**: Prompt for conversion factor when needed
- **Predefined Factor**: Set a predefined conversion factor in settings (optional)

## Usage

### Commands

The extension provides two main commands:

1. **Convert BigInt** (`bigint-converter.convert-bigint-to-number`)

   - Converts selected BigInt to a regular number
   - Removes the 'n' suffix from the result

2. **Convert BigInt to BigInt** (`bigint-converter.convert-bigint-to-bigint`)
   - Converts selected BigInt to a smaller BigInt value
   - Keeps the 'n' suffix in the result

### How to Use

1. **Select Text**: Highlight a BigInt value in your code (e.g., `123456789012345678901234567890n`)
2. **Run Command**:
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Type "Convert BigInt" and select the desired command
   - Or use the keyboard shortcut (if configured)
3. **Enter Factor**: If not using a predefined factor, enter the conversion factor (10^n)
4. **View Result**: The selected BigInt will be replaced with the converted value

### Examples

**Input**: `123456789012345678901234567890n` with factor 30

**Convert BigInt Output**: `123456789.01234567890123456789`

**Convert BigInt to BigInt Output**: `123456789n`

## Configuration

You can configure the extension behavior in VS Code settings:

```json
{
  "bigintConverter.defaultFactor": 30
}
```

### Settings

- **`bigintConverter.defaultFactor`** (number, default: 30)

  - The default exponent for conversion (10^n)
  - This value is used when no factor is specified during conversion

- **`bigintConverter.predefinedFactor`** (number, default: undefined)
  - The predefined exponent for conversion (10^n)
  - This value forces the conversion factor to be used, no input is required
