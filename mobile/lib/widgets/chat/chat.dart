import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:mobile/widgets/chat/messages_block.dart';

class User {
  final String id;
  final String avatar;
  final String name;

  User(this.id, this.avatar, this.name);
}

class Message {
  final String id;
  final String text;
  final User user;

  Message(this.id, this.text, this.user);
}

class Chat extends StatelessWidget {
  final List<Message> messages;
  final String userId;
  List<MessagesBlock> messagesBlocks = [];

  Chat({
    super.key,
    required this.messages,
    required this.userId,
  });

  List<MessagesBlock> renderBlockList() {
    List<MessagesBlock> blockList = [];
    List<Message> msgList = [];

    for (var i = 0; i < messages.length; i++) {
      if (msgList.isEmpty) {
        msgList.add(messages[i]);
        continue;
      }

      var lastMsg = msgList[msgList.length - 1];
      var curMsg = messages[i];

      // TODO: check time too
      if (curMsg.user.id == lastMsg.user.id) {
        msgList.add(messages[i]);
      }

      if (curMsg.user.id != lastMsg.user.id || i == messages.length - 1) {
        blockList.add(MessagesBlock(
          messages: List.from(msgList),
          userId: userId,
        ));
        msgList.clear();
      }
    }

    return blockList;
  }

  @override
  Widget build(BuildContext context) {
    var blockList = renderBlockList();

    return Container(
      child: ListView.builder(
        itemCount: blockList.length,
        itemBuilder: (context, index) => Row(
          children: [blockList[index]],
        ),
      ),
    );
  }
}
