import Toast from "react-native-toast-message";

export function toastError(message: string, title = "Erro") {
  Toast.show({ type: "error", text1: title, text2: message });
}

export function toastSuccess(message: string, title = "Sucesso") {
  Toast.show({ type: "success", text1: title, text2: message });
}