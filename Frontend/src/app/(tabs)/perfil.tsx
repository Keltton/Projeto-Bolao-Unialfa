import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/services/api";
import { editarPerfil, excluirMinhaConta } from "@/services/usuarioService";
import { resolveImageUrl } from "@/util/imageUrl";
import { toastError, toastSuccess } from "@/util/toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmacao, setConfirmacao] = useState<"logout" | "delete" | null>(null);

  const avatarUri = resolveImageUrl(avatarUrl || user?.avatarUrl);

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

    if (!email.trim()) {
      toastError("O e-mail não pode estar em branco.");
      return;
    }

    if (senha || confirmarSenha) {
      if (senha.length < 6) {
        toastError("A senha deve ter pelo menos 6 caracteres.");
        return;
      }

      if (senha !== confirmarSenha) {
        toastError("As senhas não conferem.");
        return;
      }
    }

    setSaving(true);

    try {
      const payload: {
        nome: string;
        email: string;
        avatarUrl?: string;
        senha?: string;
      } = {
        nome: nome.trim(),
        email: email.trim(),
        avatarUrl: avatarUrl.trim(),
      };

      if (senha.trim()) {
        payload.senha = senha.trim();
      }

      const usuarioAtualizado = await editarPerfil(payload);
      await updateUser(usuarioAtualizado);

      setSenha("");
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

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Perfil</Text>
        </View>

        <View style={styles.centerContent}>
          <Ionicons name="person-circle-outline" size={54} color={theme.textSecondary} />

          <Text
            style={[
              styles.footerText,
              {
                color: theme.textSecondary,
                textAlign: "center",
                marginTop: 16,
                marginHorizontal: 24,
              },
            ]}
          >
            Entre na sua conta para acessar seu perfil, editar seus dados e acompanhar sua pontuação.
          </Text>

          <TouchableOpacity
            style={[
              styles.menuItem,
              {
                borderColor: theme.primary,
                marginTop: 24,
                justifyContent: "center",
              },
            ]}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={[styles.menuText, { color: theme.primary }]}>
              Entrar para acessar perfil
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Meu Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={[styles.avatarBorder, { borderColor: theme.primary }]}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: theme.border,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Ionicons name="person" size={36} color={theme.textSecondary} />
              </View>
            )}
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

        <View style={styles.menuContainer}>
          <Text style={[styles.headerTitle, { color: theme.text, marginBottom: 12 }]}>
            Editar Perfil
          </Text>

          <Text style={[styles.footerText, { color: theme.textSecondary }]}>Nome</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.backgroundElement,
                marginBottom: 12,
              },
            ]}
          />

          <Text style={[styles.footerText, { color: theme.textSecondary }]}>Foto Perfil</Text>
          <TextInput
            value={avatarUrl}
            onChangeText={setAvatarUrl}
            placeholder="URL da foto de perfil"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.backgroundElement,
                marginBottom: 12,
              },
            ]}
          />

          <Text style={[styles.footerText, { color: theme.textSecondary }]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor={theme.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.backgroundElement,
                marginBottom: 12,
              },
            ]}
          />

          <Text style={[styles.footerText, { color: theme.textSecondary }]}>Senha</Text>
          <TextInput
            value={senha}
            onChangeText={setSenha}
            placeholder="Nova senha"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.backgroundElement,
                marginBottom: 12,
              },
            ]}
          />

          <Text style={[styles.footerText, { color: theme.textSecondary }]}>Confirmar Senha</Text>
          <TextInput
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            placeholder="Confirme a nova senha"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.backgroundElement,
                marginBottom: 16,
              },
            ]}
          />

          <TouchableOpacity
            style={[
              styles.menuItem,
              {
                backgroundColor: theme.primary,
                borderColor: theme.primary,
                justifyContent: "center",
                opacity: saving ? 0.7 : 1,
              },
            ]}
            onPress={handleSalvarPerfil}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={theme.background} size="small" />
            ) : (
              <Text style={[styles.menuText, { color: theme.background }]}>
                Salvar alterações
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
              <Text style={[styles.menuText, { color: "#FF3B30" }]}>
                Encerrar Sessão
              </Text>
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
              <Text style={[styles.menuText, { color: "#FF3B30" }]}>
                Excluir Minha Conta
              </Text>
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