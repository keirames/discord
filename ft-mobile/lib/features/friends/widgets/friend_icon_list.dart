import 'package:flutter/material.dart';
import './friend_icon.dart';

class FriendIconList extends StatelessWidget {
  const FriendIconList({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 80,
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: const <Widget>[
          FriendIcon(),
          FriendIcon(),
          FriendIcon(),
          FriendIcon(),
          FriendIcon(),
          FriendIcon(),
          FriendIcon(),
          FriendIcon(),
          FriendIcon(),
          FriendIcon(),
          FriendIcon(),
          FriendIcon(),
          FriendIcon(),
          FriendIcon(),
          FriendIcon(),
        ],
      ),
    );
  }
}
