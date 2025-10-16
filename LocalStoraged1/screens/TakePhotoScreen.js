import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { Storage } from "../utils/storage";

export default function TakePhotoScreen({ route, navigation }) {
  const { habitId } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          skipProcessing: true,
        });
        setPhotoUri(photo.uri);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível tirar a foto");
        console.error("Camera error:", error);
      }
    }
  };

  const confirmPhoto = async () => {
    if (photoUri) {
      try {
        const today = new Date().toISOString().split("T")[0];
        const completion = {
          habitId,
          date: today,
          completed: true,
          completedAt: new Date().toISOString(),
          photo: photoUri,
        };
        await Storage.saveCompletion(completion);
        Alert.alert("✅ Sucesso", "Foto registrada para este hábito!");
        navigation.goBack();
      } catch (error) {
        Alert.alert("Erro", "Não foi possível salvar a foto");
      }
    }
  };

  const retakePhoto = () => {
    setPhotoUri(null);
  };

  // ✅ CORREÇÃO: Verificação segura para Constants
  const switchCamera = () => {
    if (!Camera.Constants) {
      Alert.alert("Info", "Trocar câmera não suportada neste dispositivo");
      return;
    }

    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Solicitando permissão da câmera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Permissão para usar a câmera negada.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && !photoUri ? (
        <Camera style={styles.camera} ref={cameraRef} type={cameraType}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.switchCameraButton}
              onPress={switchCamera}
            >
              <Text style={styles.switchCameraText}>🔄</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />
      )}

      <View style={styles.controls}>
        {!photoUri ? (
          <>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={retakePhoto}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>🔄 Refazer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmPhoto}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>✅ Usar Foto</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
  },
  switchCameraButton: {
    alignSelf: "flex-start",
    padding: 10,
  },
  switchCameraText: {
    fontSize: 24,
    color: "#fff",
  },
  preview: {
    flex: 1,
    resizeMode: "cover",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  secondaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  message: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
