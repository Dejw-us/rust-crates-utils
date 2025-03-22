import * as vscode from "vscode";
import { addCrates } from "./commands/addCrates";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(addCrates);
}

export function deactivate() {}
