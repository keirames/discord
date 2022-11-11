import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class SearchBar extends StatelessWidget {
  const SearchBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 0,
        vertical: 0,
      ),
      child: const TextField(
        decoration: InputDecoration(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.all(
              Radius.circular(30.0),
            ),
          ),
          hintText: "Search",
          prefixIcon: Icon(
            Icons.search,
            color: Color.fromARGB(255, 153, 153, 153),
          ),
          contentPadding: EdgeInsets.symmetric(vertical: 0),
          isDense: true,
          fillColor: Color.fromARGB(255, 239, 239, 239),
          filled: true,
          enabledBorder: OutlineInputBorder(
            borderSide: BorderSide(
              color: Color.fromARGB(255, 255, 255, 255),
              width: 0.0,
            ),
            borderRadius: BorderRadius.all(
              Radius.circular(30.0),
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(
              color: Color.fromARGB(21, 246, 248, 255),
              width: 0.0,
            ),
            borderRadius: BorderRadius.all(
              Radius.circular(30.0),
            ),
          ),
        ),
        style: TextStyle(
          color: Color.fromARGB(255, 0, 0, 0),
        ),
      ),
    );
  }
}
