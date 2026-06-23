import { GuestGate } from "@/components/GuestGate";
import { UserAvatar } from "@/components/UserAvatar";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/services/api";
import { editarPerfil, excluirMinhaConta } from "@/services/usuarioService";
import { toastError, toastSuccess } from "@/util/toast";
import { formStyles } from "@/styles/shared/formStyle";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "@/styles/tabs/perfilStyle";

export default function Perfil() {
  const router = useRouter();
  const theme = Colors.dark;
  const { user, isAuthenticated, signOut, updateUser } = useAuth();

  const [nome, setNome] = useState(user?.nome ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmacao, setConfirmacao] = useState<"logout" | "delete" | null>(null);

  useEffect(() => {
    if (user) {
      setNome(user.nome ?? "");
      setEmail(user.email ?? "");
      setAvatarUrl(user.avatarUrl ?? "");
    }
  }, [user]);

  const handleSalvarPerfil = async () => {
    if (!nome.trim()) {
      toastError("O nome não pode estar em branco.");
      return;
    }

    if (nome.trim().length < 3) {
      toastError("O nome deve ter no mínimo 3 caracteres.");
      return;
    }

    if (!email.trim()) {
      toastError("O e-mail não pode estar em branco.");
      return;
    }

    const querTrocarSenha = novaSenha.trim() || confirmarSenha.trim() || senhaAtual.trim();

    if (querTrocarSenha) {
      if (!senhaAtual.trim()) {
        toastError("Informe a senha atual para definir uma nova senha.");
        return;
      }

      if (novaSenha.length < 6) {
        toastError("A nova senha deve ter no mínimo 6 caracteres.");
        return;
      }

      if (novaSenha !== confirmarSenha) {
        toastError("As senhas não conferem.");
        return;
      }
    }

    setSaving(true);

    try {
      const usuarioAtualizado = await editarPerfil({
        nome: nome.trim(),
        email: email.trim(),
        avatarUrl: avatarUrl.trim() || null,
        ...(querTrocarSenha
          ? {
              senhaAtual: senhaAtual.trim(),
              novaSenha: novaSenha.trim(),
            }
          : {}),
      });

      await updateUser(usuarioAtualizado);

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");

      toastSuccess("Perfil atualizado com sucesso!");
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
      router.replace("/(tabs)/partidas");
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
      router.replace("/(tabs)/partidas");
    } catch (error) {
      toastError(getApiErrorMessage(error, "Erro ao excluir conta."));
    } finally {
      setDeleting(false);
      setConfirmacao(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <GuestGate
        title="Perfil"
        icon="person-circle-outline"
        message="Entre na sua conta para acessar seu perfil, editar seus dados e acompanhar sua pontuação."
        primaryLabel="Entrar"
        onPrimary={() => router.push("/auth/login")}
        onSecondary={() => router.push("/auth/cadastro")}
      />
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const renderPasswordField = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    visible: boolean,
    onToggle: () => void,
    placeholder: string
  ) => (
    <View style={formStyles.inputGroup}>
      <Text style={[formStyles.label, { color: theme.textSecondary }]}>{label}</Text>
      <View style={[formStyles.glassInput, { borderColor: theme.border }]}>
        <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="rgba(189, 202, 185, 0.5)"
          secureTextEntry={!visible}
          style={[formStyles.textInput, { color: theme.text }]}
        />
        <TouchableOpacity onPress={onToggle}>
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Meu Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={[styles.avatarBorder, { borderColor: theme.primary }]}>
            <UserAvatar
              nome={nome.trim() || user.nome}
              avatarUrl={avatarUrl || user.avatarUrl}
              size={88}
            />
          </View>

          <Text style={[styles.nameText, { color: theme.text }]}>{user.nome}</Text>
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

        <View style={[formStyles.formCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <Text style={[formStyles.sectionTitle, { color: theme.text }]}>Editar perfil</Text>

          <View style={formStyles.inputGroup}>
            <Text style={[formStyles.label, { color: theme.textSecondary }]}>Nome</Text>
            <View style={[formStyles.glassInput, { borderColor: theme.border }]}>
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome"
                placeholderTextColor="rgba(189, 202, 185, 0.5)"
                autoCapitalize="words"
                style={[formStyles.textInput, { color: theme.text }]}
              />
            </View>
          </View>

          <View style={formStyles.inputGroup}>
            <Text style={[formStyles.label, { color: theme.textSecondary }]}>E-mail</Text>
            <View style={[formStyles.glassInput, { borderColor: theme.border }]}>
              <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="rgba(189, 202, 185, 0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                style={[formStyles.textInput, { color: theme.text }]}
              />
            </View>
          </View>

          <View style={formStyles.inputGroup}>
            <Text style={[formStyles.label, { color: theme.textSecondary }]}>
              URL da foto (opcional)
            </Text>
            <View style={[formStyles.glassInput, { borderColor: theme.border }]}>
              <Ionicons name="image-outline" size={20} color={theme.textSecondary} />
              <TextInput
                value={avatarUrl}
                onChangeText={setAvatarUrl}
                placeholder="https://..."
                placeholderTextColor="rgba(189, 202, 185, 0.5)"
                autoCapitalize="none"
                style={[formStyles.textInput, { color: theme.text }]}
              />
            </View>
          </View>

          {renderPasswordField(
            "Senha atual",
            senhaAtual,
            setSenhaAtual,
            mostrarSenhaAtual,
            () => setMostrarSenhaAtual(!mostrarSenhaAtual),
            "Preencha apenas se for trocar a senha"
          )}

          {renderPasswordField(
            "Nova senha",
            novaSenha,
            setNovaSenha,
            mostrarNovaSenha,
            () => setMostrarNovaSenha(!mostrarNovaSenha),
            "Mínimo 6 caracteres"
          )}

          {renderPasswordField(
            "Confirmar nova senha",
            confirmarSenha,
            setConfirmarSenha,
            mostrarNovaSenha,
            () => setMostrarNovaSenha(!mostrarNovaSenha),
            "Repita a nova senha"
          )}

          <TouchableOpacity
            style={[
              formStyles.primaryButton,
              {
                backgroundColor: theme.secondary,
                opacity: saving ? 0.7 : 1,
              },
            ]}
            onPress={handleSalvarPerfil}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={theme.background} size="small" />
            ) : (
              <Text style={[formStyles.primaryButtonText, { color: theme.background }]}>
                SALVAR ALTERAÇÕES
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[
              styles.menuItem,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
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
            style={[
              styles.menuItem,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
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
          <View
            style={[
              styles.confirmBox,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.confirmTitle, { color: theme.text }]}>
              {confirmacao === "logout" ? "Encerrar sessão?" : "Excluir conta?"}
            </Text>

            <Text style={[styles.confirmMessage, { color: theme.textSecondary }]}>
              {confirmacao === "logout"
                ? "Você continuará podendo ver partidas e ranking como visitante."
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
                style={[
                  styles.confirmBtn,
                  {
                    backgroundColor: "#FF3B30",
                    borderColor: "#FF3B30",
                  },
                ]}
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
      </ScrollView>
    </SafeAreaView>
  );
}
