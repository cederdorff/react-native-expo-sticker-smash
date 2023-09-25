import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import PlaceholderImage from "./assets/images/background-image.png";
import Button from "./components/Button";
import ImageViewer from "./components/ImageViewer";
import IconButton from "./components/IconButton";
import CircleButton from "./components/CircleButton";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAppOptions, setShowAppOptions] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pickedEmoji, setPickedEmoji] = useState(null);

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

    async function onSaveImageAsync() {}

    function onModalClose() {
        setIsModalVisible(false);
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.imageContainer}>
                <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
                {pickedEmoji !== null ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> : null}
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
