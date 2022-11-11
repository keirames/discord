import 'package:flutter/material.dart';
import 'package:mobile/features/friends/friends.dart';
import 'package:mobile/profile_avatar.dart';
import 'package:mobile/search_bar.dart';

class ChatBox extends StatelessWidget {
  const ChatBox({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFFFFFFF),
      child: Column(
        children: const <Widget>[
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 10),
            child: SearchBar(),
          ),
          FriendIconList(),
        ],
      ),
    );
  }
}
