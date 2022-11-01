import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';

enum BubbleType {
  first,
  middle,
  last,
  only,
}

class Bubble extends StatelessWidget {
  final BubbleType type;
  final String text;
  bool isOwner;

  Bubble({
    super.key,
    required this.type,
    required this.text,
    this.isOwner = false,
  });

  Align renderFirstBubble() {
    return Align(
      alignment: Alignment.bottomLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 1, top: 1),
        padding: const EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          color: Colors.blue[200],
          borderRadius: const BorderRadius.only(
            topRight: Radius.circular(15),
            bottomRight: Radius.circular(15),
            topLeft: Radius.circular(15),
            bottomLeft: Radius.circular(4),
          ),
        ),
        child: Text(text),
      ),
    );
  }

  Align renderMiddleBubble() {
    return Align(
      alignment: Alignment.bottomLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 1, top: 1),
        padding: const EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          color: Colors.blue[200],
          borderRadius: const BorderRadius.only(
            topRight: Radius.circular(15),
            bottomRight: Radius.circular(15),
            topLeft: Radius.circular(4),
            bottomLeft: Radius.circular(4),
          ),
        ),
        child: Text(text),
      ),
    );
  }

  Align renderLastBubble() {
    return Align(
      alignment: Alignment.bottomLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 1, top: 1),
        padding: const EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          color: Colors.blue[200],
          borderRadius: const BorderRadius.only(
            topRight: Radius.circular(15),
            bottomRight: Radius.circular(15),
            topLeft: Radius.circular(4),
            bottomLeft: Radius.circular(15),
          ),
        ),
        child: Text(text),
      ),
    );
  }

  Align renderOnlyBubble() {
    return Align(
      alignment: Alignment.bottomLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 1, top: 1),
        padding: const EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          color: Colors.blue[200],
          borderRadius: const BorderRadius.only(
            topRight: Radius.circular(15),
            bottomRight: Radius.circular(15),
            topLeft: Radius.circular(15),
            bottomLeft: Radius.circular(15),
          ),
        ),
        child: Text(text),
      ),
    );
  }

  Align renderBubble() {
    switch (type) {
      case BubbleType.only:
        return renderFirstBubble();
      case BubbleType.first:
        return renderFirstBubble();
      case BubbleType.middle:
        return renderMiddleBubble();
      case BubbleType.last:
        return renderLastBubble();
      default:
        throw Error();
    }
  }

  @override
  Widget build(BuildContext context) {
    return renderBubble();
  }
}
