import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

interface ChatBubbleProps {
  content: string;
  role: 'user' | 'assistant';
}

export function ChatBubble({ content, role }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
        {content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
  },
  aiContainer: {
    backgroundColor: colors.chatBubbleAI,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userContainer: {
    backgroundColor: colors.chatBubbleUser,
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: colors.chatBubbleUserBorder,
    borderBottomRightRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  aiText: {
    color: colors.onSurface,
  },
  userText: {
    color: colors.onSurface,
  },
});
