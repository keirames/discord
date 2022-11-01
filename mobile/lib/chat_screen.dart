import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:mobile/chat_box.dart';
import 'package:mobile/chats.dart';
import 'package:mobile/friend_list.dart';
import 'package:mobile/profile_avatar.dart';
import 'package:mobile/search_bar.dart';

class ChatScreen extends StatelessWidget {
  const ChatScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: const Text("Bad Chats"),
        leading: const ProfileAvatar(),
        actions: <Widget>[
          IconButton(
            color: Color.fromARGB(255, 126, 126, 126),
            icon: const Icon(Icons.widgets_rounded),
            splashRadius: 20,
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('This is a snackbar')));
            },
          ),
        ],
      ),
      body: Container(
        color: const Color(0xFFFFFFFF),
        child: ListView(
          children: const <Widget>[
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 10),
              child: SearchBar(),
            ),
            FriendList(),
            Chats(),
          ],
        ),
      ),
    );
  }
}
