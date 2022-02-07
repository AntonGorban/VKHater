import "dotenv/config";
import { VK, API } from "vk-io";

const myId = Number(process.env.MY_VK_ID);

(async () => {
  try {
    const api = new API({
      token: process.env.VK_API_KEY as string,
    });

    const vk = new VK({
      token: process.env.VK_API_KEY as string,
    });

    vk.updates.on("message_new", async (context) => {
      const message = await api.messages.getById({ message_ids: context.id }).then((messages) => messages.items[0]);
      const user = await api.users.get({ user_ids: String(message.from_id) }).then((users) => users[0]);
      // const conversationMembers = await api.messages.getConversationMembers({ peer_id: context.peerId });
      // const conversations = await api.messages.getConversations({
      //   peer_id: context.peerId,
      //   start_message_id: context.id,
      // });

      // debugger;
      if (!isBotMessage(context.text || "", user.id))
        await context.send(
          templateString(
            `ID: ${user.id}
${user.first_name} ${user.last_name}`
          ),
          { dont_parse_links: true }
        );
    });

    await vk.updates.start();
  } catch (error) {
    debugger;
    console.dir(error);
  }
})();

const templateString = (text = "I Hate VK") =>
  `${text}
-- -- --
From: VKHater
https://github.com/AntonGorban/VKHater`;

const isBotMessage = (message: string, userId: number) => userId === myId && message.match("From: VKHater");

const xz = (context: any) => `
/* ---------------------------- Инфа по сообщения --------------------------- */
id сообщения [id] : ${context.id},
id сообщения беседы [conversationMessageId] : ${context.conversationMessageId},
есть ли текст [hasText] : ${context.hasText},
ответное сообщение [hasReplyMessage] : ${context.hasReplyMessage},
переадресованное сообщение [hasForwards] : ${context.hasForwards},
особое событие [isEvent] : ${context.isEvent},
createdAt [createdAt] : ${context.createdAt},
updatedAt [updatedAt] : ${context.updatedAt},
/* ----------------------------- Инфа по беседе ----------------------------- */
это чат [isChat] : ${context.isChat},
это юзверь [isUser] : ${context.isUser},
это группа [isGroup] : ${context.isGroup},
от пользователя [isFromUser] : ${context.isFromUser},
от группы [isFromGroup] : ${context.isFromGroup},
лс [isDM] : ${context.isDM},
id чата [chatId] : ${context.chatId},
id отправителя [senderId] : ${context.senderId},
id назначения ? [peerId] : ${context.peerId},
тип назначения ? [peerType] : ${context.peerType},
`;
