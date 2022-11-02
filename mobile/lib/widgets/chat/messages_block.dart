import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:mobile/profile_avatar.dart';
import 'package:mobile/widgets/chat/bubble.dart';
import 'package:mobile/widgets/chat/chat.dart';

class MessagesBlock extends StatefulWidget {
  final List<Message> messages;
  final String userId;

  const MessagesBlock({
    super.key,
    required this.messages,
    required this.userId,
  });

  @override
  State<MessagesBlock> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MessagesBlock> {
  var scrollController = ScrollController();

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      scrollController.jumpTo(scrollController.position.maxScrollExtent);
    });
  }

  List<Bubble> renderBubbles() {
    List<Bubble> bubbles = [];

    if (widget.messages.length == 1) {
      bubbles.add(Bubble(
        type: BubbleType.only,
        text: widget.messages[0].text,
        isOwner: widget.userId == widget.messages[0].user.id,
      ));
      return bubbles;
    }

    for (var i = 0; i < widget.messages.length; i++) {
      var msg = widget.messages[i];

      if (i == 0) {
        bubbles.add(Bubble(
          type: BubbleType.first,
          text: msg.text,
          isOwner: widget.userId == msg.user.id,
        ));
        continue;
      }

      if (i == widget.messages.length - 1) {
        bubbles.add(Bubble(
          type: BubbleType.last,
          text: msg.text,
          isOwner: widget.userId == msg.user.id,
        ));
        continue;
      }

      bubbles.add(Bubble(
        type: BubbleType.middle,
        text: msg.text,
        isOwner: widget.userId == msg.user.id,
      ));
    }

    return bubbles;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      width: MediaQuery.of(context).size.width * 1,
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              const Padding(
                padding: EdgeInsets.only(left: 4, right: 4),
                child: ProfileAvatar(),
              ),
              Expanded(
                child: ListView(
                  controller: scrollController,
                  shrinkWrap: true,
                  children: renderBubbles(),
                ),
              )
            ],
          ),
        ],
      ),
    );
  }
}
