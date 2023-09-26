import domtoimage from "dom-to-image";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PlaceholderImage from "./assets/images/background-image.png";
import Button from "./components/Button";
import CircleButton from "./components/CircleButton";
import EmojiList from "./components/EmojiList";
import EmojiPicker from "./components/EmojiPicker";
import EmojiSticker from "./components/EmojiSticker";
import IconButton from "./components/IconButton";
import ImageViewer from "./components/ImageViewer";
import { captureRef } from "react-native-view-shot";

export default function App() {
    const [status, requestPermission] = MediaLibrary.usePermissions();
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAppOptions, setShowAppOptions] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pickedEmoji, setPickedEmoji] = useState(null);
    const imageRef = useRef();

    if (status === null) {
        requestPermission();
    }

    async function pickImageAsync() {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1
        });

        if (!result.canceled) {
            console.log(result);
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true);
        } else {
            alert("You did not select any image.");
        }
    }

    function onUseImage() {
        setShowAppOptions(true);
    }

    function onReset() {
        setShowAppOptions(false);
    }

    function onAddSticker() {
        setIsModalVisible(true);
    }

    async function onSaveImageAsync() {
        if (Platform.OS !== "web") {
            try {
                const localUri = await captureRef(imageRef, {
                    height: 440,
                    quality: 1
                });
                await MediaLibrary.saveToLibraryAsync(localUri);
                if (localUri) {
                    alert("Saved!");
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                const dataUrl = await domtoimage.toJpeg(imageRef.current, {
                    quality: 0.95,
                    width: 320,
                    height: 440
                });

                let link = document.createElement("a");
                link.download = "sticker-smash.jpeg";
                link.href = dataUrl;
                link.click();
                console.log(link);
            } catch (e) {
                console.log(e);
            }
        }
    }

    function onModalClose() {
        setIsModalVisible(false);
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.imageContainer}>
                <View ref={imageRef} collapsable={false}>
                    <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
                    {pickedEmoji !== null ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> : null}
                </View>
            </View>

            {showAppOptions ? (
                <View style={styles.optionsContainer}>
                    <View style={styles.optionsRow}>
                        <IconButton icon="refresh" label="Reset" onPress={onReset} />
                        <CircleButton onPress={onAddSticker} />
                        <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
                    </View>
                </View>
            ) : (
                <View style={styles.footerContainer}>
                    <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
                    <Button label="Use this photo" onPress={onUseImage} />
                </View>
            )}
            <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
                <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
            </EmojiPicker>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        alignItems: "center"
    },
    imageContainer: {
        flex: 1,
        paddingTop: 58
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: "center"
    },
    optionsContainer: {
        position: "absolute",
        bottom: 30
    },
    optionsRow: {
        alignItems: "center",
        flexDirection: "row"
    }
});
