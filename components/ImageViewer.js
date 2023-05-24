import { StyleSheet, Image } from "react-native";

export default function ImageViewer({ placeholderImageSource, selectedImage }) {
    let image = placeholderImageSource;

    if (selectedImage) {
        image = selectedImage;
    }
    console.log(image);

    return <Image source={image} style={styles.image} />;
}

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 440,
        borderRadius: 18
    }
});
