import { customEmojis, EmoteKeys } from './emoji-data';

const validationRegex = {
  link: /(https?\:\/\/[^ ]+)/gi,
  mention: /\@([a-zA-Z0-9_]{4,})/gi,
  emote: /\:([a-z0-9]+)\:/gi,
  block: /\`(.*?)\`/gi,

  global:
    /(\`.*?\`)|(\@[a-zA-Z0-9_]{4,})|(\:[a-z0-9]+\:)|(https?\:\/\/[^ ]+)/gi,

  unicodeEmoji:
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])/gm,
};

const tokenTypes = ['text', 'emote'] as const;
type TokenType = typeof tokenTypes[number];
type TokenMessage = { type: TokenType; value: string };

const validateMap: Record<Exclude<TokenType, 'text'>, { regex: RegExp }> = {
  emote: {
    regex: validationRegex.emote,
  },
};

const getType = (message: string): TokenType => {
  let type: TokenType = 'text';
  tokenTypes
    // using filter make typescript confuse on type, we want all type exclude 'text'
    .flatMap((tt) => (tt !== 'text' ? tt : []))
    .forEach((tt) => {
      if (message.match(validateMap[tt].regex)) {
        type = tt;
      }
    });

  return type;
};

const filterString = (
  emotes: { name: string }[],
  message: string,
): TokenMessage[] => {
  const tokens: TokenMessage[] = [];

  const val = message
    .split(validationRegex.global)
    .filter((i) => i !== undefined && i !== '');

  val.forEach((m) => {
    let type = getType(m);

    if (type === 'emote') {
      type = 'text';

      // is emote if custom emote include in supported list
      for (const emote of emotes) {
        if (m.trim().toLowerCase() === `:${emote.name}:`) {
          m = emote.name;
          type = 'emote';
          break;
        }
      }
    }

    tokens.push({ type, value: m });
  });

  return tokens;
};

export const decode = (token: string) => {
  return filterString(
    customEmojis.map((ce) => ({ name: ce.name })),
    token,
  );
};
