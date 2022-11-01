import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:mobile/chat_pipe.dart';

class Chats extends StatelessWidget {
  const Chats({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: const [
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
        ChatPipe(),
      ],
    );
  }
}
