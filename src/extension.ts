import * as vscode from "vscode";

/**
 * Convert BigInt string to a more readable format by dividing by 10^n
 */
function convertBigInt(bigIntString: string, factor = 30): string {
  try {
    // Remove 'n' suffix if present and trim whitespace
    const cleanedStr = bigIntString.trim().replace(/n$/, "");

    // Convert to BigInt
    const originalValue = BigInt(cleanedStr);

    // Calculate divisor
    const divisor = BigInt(10) ** BigInt(factor);

    // Perform division
    const quotient = originalValue / divisor;
    const remainder = originalValue % divisor;

    // Format with decimal places if there's a remainder
    if (remainder === BigInt(0)) {
      return `${quotient}`;
    } else {
      // Convert remainder to string with leading zeros
      let remainderStr = remainder.toString();
      remainderStr = remainderStr.padStart(factor, "0");

      // Trim trailing zeros
      remainderStr = remainderStr.replace(/0+$/, "");

      if (remainderStr) {
        return `${quotient}.${remainderStr}`;
      } else {
        return `${quotient}`;
      }
    }
  } catch (error) {
    throw new Error(`Invalid BigInt value: ${error}`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("BigInt Converter extension activated");

  const disposable = vscode.commands.registerCommand("bigint-converter.convert", async () => {
    // Get active text editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor");
      return;
    }

    // Get selected text
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (!selectedText) {
      vscode.window.showErrorMessage("No text selected");
      return;
    }

    // Get default factor from settings
    const config = vscode.workspace.getConfiguration("bigintConverter");
    const defaultFactor = config.get<number>("defaultFactor") || 30;

    // Ask user for custom factor or use default
    const inputFactor = await vscode.window.showInputBox({
      prompt: "Enter factor (10^n) for conversion",
      placeHolder: `Default is ${defaultFactor}`,
      value: defaultFactor.toString(),
    });

    // Use default if user cancels or enters invalid value
    const factor = inputFactor ? parseInt(inputFactor, 10) : defaultFactor;

    if (isNaN(factor)) {
      vscode.window.showErrorMessage("Invalid factor value");
      return;
    }

    try {
      // Convert the BigInt value
      const result = convertBigInt(selectedText, factor);

      // Replace selected text with converted value
      editor.edit((editBuilder) => {
        editBuilder.replace(selection, result);
      });

      vscode.window.showInformationMessage(`Converted using factor: 10^${factor}`);
    } catch (error) {
      vscode.window.showErrorMessage(`${error}`);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
