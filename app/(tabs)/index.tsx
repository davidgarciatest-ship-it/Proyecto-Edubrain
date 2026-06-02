import { useEffect, useRef } from 'react';
import { FlatList, View, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatBubble } from '../../src/components/ChatBubble';
import { ChatInput } from '../../src/components/ChatInput';
import { TypingIndicator } from '../../src/components/TypingIndicator';
import { useChat } from '../../src/hooks/useChat';
import { colors } from '../../src/constants/colors';

export default function ChatScreen() {
  const { messages, isLoading, error, send, loadHistory } = useChat();
  const listRef = useRef<FlatList>(null);
  useEffect(() => { loadHistory() }, [loadHistory]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <FlatList ref={listRef} style={styles.list} contentContainerStyle={styles.listContent}
          data={messages} keyExtractor={(i) => i.id.toString()} renderItem={({ item }) => <ChatBubble content={item.content} role={item.role} />}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })} ListFooterComponent={isLoading ? <TypingIndicator /> : null}
          ListEmptyComponent={!isLoading ? <View style={styles.empty}><Text style={styles.emptyTitle}>EduBrain</Text><Text style={styles.emptySub}>¡Hola! Soy tu asistente educativo. Pregúntame sobre nutrición, técnicas de estudio, o registra tus hábitos.</Text></View> : null} />
        {error && <View style={styles.errorBar}><Text style={styles.errorText}>{error}</Text></View>}
        <ChatInput onSend={(m) => send(m)} disabled={isLoading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 8, flexGrow: 1, justifyContent: 'flex-end' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyTitle: { fontSize: 28, fontWeight: '700', color: colors.primary, marginBottom: 12 },
  emptySub: { fontSize: 16, lineHeight: 24, color: colors.onSurfaceVariant, textAlign: 'center' },
  errorBar: { backgroundColor: colors.errorContainer, paddingHorizontal: 16, paddingVertical: 8 },
  errorText: { color: colors.error, fontSize: 14 },
});
