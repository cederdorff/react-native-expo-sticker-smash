import { StyleSheet, Image } from "react-native";

export default function ImageViewer({ placeholderImageSource, selectedImage }) {
    let imageSource = placeholderImageSource;

    if (selectedImage) {
        imageSource = { uri: selectedImage };
    }

    return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 440,
        borderRadius: 18
    }
});
