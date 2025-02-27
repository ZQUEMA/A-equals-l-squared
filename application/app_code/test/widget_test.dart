import 'package:application/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void templateFunction() {
  testWidgets('Just a basic template test', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    /// Launch the main page of the project

    expect(find.text('You have pushed the button this many times:'),
        findsOneWidget);

    /// Find a text containing this
    expect(find.text('1'), findsNothing);

    /// Expected no widget containing '1'

    await tester.tap(find.byIcon(Icons.add));

    /// Click on a button containing the 'add' icon
    await tester.pump();

    /// Update the page (Do it after each action performing a set state.
  });
}

void main() {
  templateFunction();
}
