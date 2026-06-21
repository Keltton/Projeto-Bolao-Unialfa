import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/services/api";
import { editarPerfil, excluirMinhaConta } from "@/services/usuarioService";
import { resolveImageUrl } from "@/util/imageUrl";
import { toastError, toastSuccess } from "@/util/toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "@/styles/tabs/perfilStyle";

export default function Perfil() {
  const router = useRouter();
  const theme = Colors.dark;
  const { user, signOut, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editNome, setEditNome] = useState(user?.nome ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmacao, setConfirmacao] = useState<"logout" | "delete" | null>(null);

  const avatarUri = resolveImageUrl(user?.avatarUrl);

  const handleSaveNome = async () => {
    if (!editNome.trim()) {
      toastError("O nome não pode estar em branco.");
      return;
    }

    setSaving(true);
    try {
      const usuarioAtualizado = await editarPerfil({ nome: editNome.trim() });
      await updateUser(usuarioAtualizado);
      setIsEditing(false);
      toastSuccess("Nome atualizado com sucesso!");
    } catch (error) {
      toastError(getApiErrorMessage(error, "Erro ao atualizar perfil."));
    } finally {
      setSaving(false);
    }
  };

  const executarLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      router.replace("/auth/login");
    } catch {
      toastError("Erro ao encerrar sessão.");
    } finally {
      setLoggingOut(false);
      setConfirmacao(null);
    }
  };

  const executarExclusao = async () => {
    setDeleting(true);
    try {
      await excluirMinhaConta();
      await signOut();
      toastSuccess("Sua conta foi excluída.", "Conta removida");
      router.replace("/auth/login");
    } catch (error) {
      toastError(getApiErrorMessage(error, "Erro ao excluir conta."));
    } finally {
      setDeleting(false);
      setConfirmacao(null);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Meu Perfil</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={[styles.avatarBorder, { borderColor: theme.primary }]}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.border, justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Ionicons name="person" size={36} color={theme.textSecondary} />
            </View>
          )}
        </View>

        {isEditing ? (
          <View style={styles.editRow}>
            <TextInput
              value={editNome}
              onChangeText={setEditNome}
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement },
              ]}
              autoFocus
              editable={!saving}
            />
            <TouchableOpacity
              onPress={handleSaveNome}
              style={[styles.saveBtn, { backgroundColor: theme.primary, opacity: saving ? 0.7 : 1 }]}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={theme.background} size="small" />
              ) : (
                <Ionicons name="checkmark" size={20} color={theme.background} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setEditNome(user.nome);
                setIsEditing(false);
              }}
              style={[styles.cancelBtn, { borderColor: theme.border }]}
              disabled={saving}
            >
              <Ionicons name="close" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nameRow}>
            <Text style={[styles.nameText, { color: theme.text }]}>{user.nome}</Text>
            <TouchableOpacity
              onPress={() => {
                setEditNome(user.nome);
                setIsEditing(true);
              }}
            >
              <Ionicons name="create-outline" size={18} color={theme.primary} />
            </TouchableOpacity>
          </View>
        )}

        <Text style={[styles.emailText, { color: theme.textSecondary }]}>{user.email}</Text>

        <View style={styles.statsRow}>
          <Text style={[styles.statMini, { color: theme.primary }]}>
            {user.pontuacaoTotal} pts
          </Text>
          <Text style={[styles.statMini, { color: theme.textSecondary }]}>
            {user.placaresExatos} exatos
          </Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
          onPress={() => setConfirmacao("logout")}
          disabled={loggingOut || deleting}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={[styles.menuText, { color: "#FF3B30" }]}>Encerrar Sessão</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
          onPress={() => setConfirmacao("delete")}
          disabled={loggingOut || deleting}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            <Text style={[styles.menuText, { color: "#FF3B30" }]}>Excluir Minha Conta</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {confirmacao && (
        <View style={[styles.confirmBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <Text style={[styles.confirmTitle, { color: theme.text }]}>
            {confirmacao === "logout" ? "Encerrar sessão?" : "Excluir conta?"}
          </Text>
          <Text style={[styles.confirmMessage, { color: theme.textSecondary }]}>
            {confirmacao === "logout"
              ? "Você precisará fazer login novamente."
              : "Esta ação é permanente. Seus palpites serão removidos."}
          </Text>
          <View style={styles.confirmActions}>
            <TouchableOpacity
              style={[styles.confirmBtn, { borderColor: theme.border }]}
              onPress={() => setConfirmacao(null)}
              disabled={loggingOut || deleting}
            >
              <Text style={{ color: theme.text, fontWeight: "600" }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: "#FF3B30", borderColor: "#FF3B30" }]}
              onPress={confirmacao === "logout" ? executarLogout : executarExclusao}
              disabled={loggingOut || deleting}
            >
              {loggingOut || deleting ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={{ color: "#FFF", fontWeight: "700" }}>
                  {confirmacao === "logout" ? "Sair" : "Excluir"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.footerBanner} pointerEvents="none">
        <Ionicons name="shield-checkmark-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Seus dados estão protegidos em conformidade com a LGPD.
        </Text>
      </View>
    </SafeAreaView>
  );
}
