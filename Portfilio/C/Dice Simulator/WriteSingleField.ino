

/*
  WriteSingleField
  
  Description: Writes a value to a channel on ThingSpeak every 20 seconds.
  
  Hardware: ESP32 based boards
  
  !!! IMPORTANT - Modify the secrets.h file for this project with your network connection and ThingSpeak channel details. !!!
  
  Note:
  - Requires installation of EPS32 core. See https://github.com/espressif/arduino-esp32/blob/master/docs/arduino-ide/boards_manager.md for details. 
  - Select the target hardware from the Tools->Board menu
  - This example is written for a network using WPA encryption. For WEP or WPA, change the WiFi.begin() call accordingly.
  
  ThingSpeak ( https://www.thingspeak.com ) is an analytic IoT platform service that allows you to aggregate, visualize, and 
  analyze live data streams in the cloud. Visit https://www.thingspeak.com to sign up for a free account and create a channel.  
  
  Documentation for the ThingSpeak Communication Library for Arduino is in the README.md folder where the library was installed.
  See https://www.mathworks.com/help/thingspeak/index.html for the full ThingSpeak documentation.
  
  For licensing information, see the accompanying license file.
  
  Copyright 2020, The MathWorks, Inc.
*/

#include <WiFi.h>
#include "secrets.h"
#include <ThingSpeak.h>  // always include thingspeak header file after other header files and custom macros
#include <M5StickC.h>

char ssid[] = SECRET_SSID;  // your network SSID (name)
char pass[] = SECRET_PASS;  // your network password
WiFiClient client;

unsigned long myChannelNumber = SECRET_CH_ID;
const char* myWriteAPIKey = SECRET_WRITE_APIKEY;

int number = 0;


#define LED_BUILTIN 10
float accX = 0;
float accY = 0;
float accZ = 0;
unsigned long currentTime = millis();
unsigned long previousTime = 0;
void setup(void) {
  M5.begin();
  M5.IMU.Init();

  Serial.begin(115200);  //Initialize serial
  while (!Serial) {
    ;  // wait for serial port to connect. Needed for Leonardo native USB port only
  }
  pinMode(LED_BUILTIN, OUTPUT);
  WiFi.mode(WIFI_STA);
  ThingSpeak.begin(client);  // Initialize ThingSpeak
}

void loop() {

  // Connect or reconnect to WiFi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(SECRET_SSID);
    while (WiFi.status() != WL_CONNECTED) {
      WiFi.begin(ssid, pass);  // Connect to WPA/WPA2 network. Change this line if using open or WEP network
      Serial.print(".");
      delay(5000);
    }
    Serial.println("\nConnected.");
  }
  currentTime = millis();
  digitalWrite(LED_BUILTIN, LOW);  // turn the LED off (HIGH is the voltage level)
  delay(100);                      // wait for a second
  digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on by making the voltage LOW
  delay(100);     
  while (1) {
    if (currentTime - previousTime > 20000) {
      previousTime = currentTime;
      break;
    }
    M5.IMU.getAccelData(&accX, &accY, &accZ);
    if (accX > 1.2 || accY > 1.2) {
      number = random(0, 6);
      break;
    }

    currentTime = millis();
  }
  // Write to ThingSpeak. There are up to 8 fields in a channel, allowing you to store up to 8 different
  // pieces of information in a channel.  Here, we write to field 1.
  int x = ThingSpeak.writeField(myChannelNumber, 1, number, myWriteAPIKey);
  if (x == 200) {
    Serial.println("Channel update successful.");
  } else {
    Serial.println("Problem updating channel. HTTP error code " + String(x));
  }

  // change the value
  number = 0;
}
