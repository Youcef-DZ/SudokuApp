import { Pressable, View, Text, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleTheme?: () => void;
  isAuthenticated: boolean;
  userName?: string;
  onLogin?: (domainHint?: string) => void;
  onLogout?: () => void;
}

export default function SettingsModal({
  visible,
  onClose,
  darkMode,
  onToggleTheme,
  isAuthenticated,
  userName,
  onLogin,
  onLogout
}: SettingsModalProps) {
  if (!visible) return null;

  const styles = getStyles(darkMode);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Settings</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={darkMode ? '#ffffff' : '#0f172a'} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            {onToggleTheme && (
              <View style={styles.row}>
                <Text style={styles.label}>Dark Mode</Text>
                <Pressable
                  style={[styles.switchContainer, darkMode && styles.switchContainerActive]}
                  onPress={onToggleTheme}
                >
                  <View style={styles.switchKnob} />
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            {isAuthenticated ? (
              <>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </Text>
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>
                      {userName || 'User'}
                    </Text>
                  </View>
                </View>
                <Pressable style={[styles.button, styles.buttonDanger]} onPress={onLogout}>
                  <Text style={[styles.buttonText, styles.buttonTextDanger]}>Sign Out</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable style={[styles.button, styles.buttonOutline]} onPress={() => onLogin?.()}>
                  <Ionicons name="log-in-outline" size={20} color={darkMode ? '#e2e8f0' : '#334155'} style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Sign In / Register</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (darkMode: boolean) => StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    minHeight: 300,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: darkMode ? '#ffffff' : '#0f172a',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: darkMode ? '#94a3b8' : '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: darkMode ? '#e2e8f0' : '#334155',
  },
  switchContainer: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: darkMode ? '#334155' : '#cbd5e1',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  switchContainerActive: {
    backgroundColor: '#2563eb',
    alignItems: 'flex-end',
  },
  switchKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    // shadowColor: '#000000',
    // shadowOffset: { width: 0, height: 1 },
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1',
    backgroundColor: 'transparent',
  },
  buttonDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: darkMode ? '#e2e8f0' : '#334155',
  },
  buttonTextDanger: {
    color: '#ef4444',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: darkMode ? '#3b82f6' : '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: darkMode ? '#ffffff' : '#1d4ed8',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: darkMode ? '#ffffff' : '#0f172a',
  },
  socialIcon: {
    fontSize: 20,
    marginRight: 8,
    color: darkMode ? '#e2e8f0' : '#334155',
  },
});
