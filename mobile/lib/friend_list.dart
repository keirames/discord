import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:mobile/friend_icon.dart';

class FriendList extends StatelessWidget {
  const FriendList({super.key});

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
