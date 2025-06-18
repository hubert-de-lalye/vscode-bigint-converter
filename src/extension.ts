import * as vscode from "vscode";

function convertBigInt(
  bigIntString: string,
  toBigint: boolean,
  factor = 30
): string {
  try {
    const cleanedStr = bigIntString.trim().replace(/n$/, "");
    const hadSuffix = bigIntString.trim().endsWith("n");
    const originalValue = BigInt(cleanedStr);
    const divisor = BigInt(10) ** BigInt(factor);
    const quotient = originalValue / divisor;
    const remainder = originalValue % divisor;

    if (remainder === BigInt(0)) {
      return toBigint ? `${quotient}${hadSuffix ? "n" : ""}` : `${quotient}`;
    } else {
      let remainderStr = remainder.toString();
      remainderStr = remainderStr.padStart(factor, "0");
      remainderStr = remainderStr.replace(/0+$/, "");

      if (remainderStr) {
        return toBigint
          ? `${quotient}${hadSuffix ? "n" : ""}`
          : `${quotient}.${remainderStr}`;
      } else {
        return toBigint ? `${quotient}${hadSuffix ? "n" : ""}` : `${quotient}`;
      }
    }
  } catch (error) {
    throw new Error(`Invalid BigInt value: ${error}`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  function convertBigint(useBigint: boolean) {
    return async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText) {
        vscode.window.showErrorMessage("No text selected");
        return;
      }

      const config = vscode.workspace.getConfiguration("bigintConverter");
      const defaultFactor = config.get<number>("defaultFactor") || 30;
      const predefinedFactor = config.get<number>("predefinedFactor");

      let factor = defaultFactor;

      if (predefinedFactor) {
        factor = predefinedFactor;
      } else {
        const inputFactor = await vscode.window.showInputBox({
          prompt: "Enter factor (10^n) for conversion",
          placeHolder: `Default is ${defaultFactor}`,
          value: defaultFactor.toString(),
        });

        factor = inputFactor ? parseInt(inputFactor, 10) : defaultFactor;
      }

      if (isNaN(factor)) {
        vscode.window.showErrorMessage("Invalid factor value");
        return;
      }

      try {
        const result = convertBigInt(selectedText, useBigint, factor);

        editor.edit((editBuilder) => {
          editBuilder.replace(selection, result);
        });

        vscode.window.showInformationMessage(
          `Converted using factor: 10^${factor}`
        );
      } catch (error) {
        vscode.window.showErrorMessage(`${error}`);
      }
    };
  }

  const disposable = vscode.commands.registerCommand(
    "bigint-converter.convert-bigint-to-number",
    convertBigint(false)
  );

  const disposableBigint = vscode.commands.registerCommand(
    "bigint-converter.convert-bigint-to-bigint",
    convertBigint(true)
  );

  context.subscriptions.push(disposable, disposableBigint);
}

export function deactivate() {}
