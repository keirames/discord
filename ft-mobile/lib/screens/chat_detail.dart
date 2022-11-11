import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:mobile/profile_avatar.dart';
import 'package:mobile/widgets/chat/chat.dart';

class ChatDetailTitle extends StatelessWidget {
  const ChatDetailTitle({super.key});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: const [ProfileAvatar(), Text('Bad Conversations')],
    );
  }
}

class ChatDetailContainer extends StatelessWidget {
  const ChatDetailContainer({super.key});

  @override
  Widget build(BuildContext context) {
    List<Message> messages = [
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "how are you ?", User("1", "", "Jerry")),
      Message("1", "Fine thk", User("2", "", "John")),
      Message("1", "?", User("1", "", "Jerry")),
      Message("1", "Bucky", User("2", "", "John")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
      Message("1", "hallo ray", User("1", "", "Jerry")),
    ];
    // List.generate(10, (index) => Message("1", "hello", User("2", "", "G")));

    return Container(
      color: Colors.white,
      child: Chat(userId: "1", messages: messages),
      // child: ListView.builder(
      //   const
      //   itemBuilder: ((context, index) => Row(
      //         children: [ChatBlock(text: fakeData)],
      //       )),
      // ),
    );
  }
}

class ChatDetail extends StatelessWidget {
  const ChatDetail({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const ChatDetailTitle(),
      ),
      body: ChatDetailContainer(),
    );
  }
}
