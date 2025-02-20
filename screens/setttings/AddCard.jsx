import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import { AppBar, AssetImage, HeightSpacer, ReusableBtn, ReusableText } from "../../components";
import { COLORS, TEXT, SIZES } from "../../constants/theme";
import reusable from "../../components/Reusable/reusable.style";

const AddCard = ({ navigation }) => {
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  return (
    <View style={{ backgroundColor: COLORS.lightWhite, flex: 1,}}>
      <View style={{ height: 40,  marginTop: 50 }}>
        <AppBar
          title={"Add Card"}
          top={10}
          left={20}
          onPress={()=> navigation.goBack()}
        />
      </View>
   

      <View style={{ marginHorizontal: 25 }}>
      
        <AssetImage
          data={require("../../assets/images/card.png")}
          width={"100%"}
          height={300}
          mode={'contain'}
        />

        <ReusableText
          text={"Card Number"}
          family={"regular"}
          size={TEXT.medium}
          color={COLORS.black}
        />

        <HeightSpacer height={10} />

        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchKey}
            onChangeText={setSearchKey}
            placeholder="0000 0000 0000 0000"
          />
        </View>

        <HeightSpacer height={20} />
        <ReusableText
          text={"Cardholder Name"}
          family={"regular"}
          size={TEXT.medium}
          color={COLORS.black}
        />

        <HeightSpacer height={10} />

        <View style={styles.inputStyle}>
          <TextInput
            style={styles.searchInput}
            value={searchKey}
            onChangeText={setSearchKey}
            placeholder="Cardholder Name"
          />
        </View>

        <HeightSpacer height={20} />
        <View style={reusable.rowWithSpace("space-between")}>
          <View style={{ width: SIZES.width / 2.4 }}>
            <ReusableText
              text={"Expiration Date"}
              family={"regular"}
              size={TEXT.medium}
              color={COLORS.black}
            />
            <HeightSpacer height={10} />

            <View style={styles.inputStyle}>
              <TextInput
                style={styles.searchInput}
                value={searchKey}
                onChangeText={setSearchKey}
                placeholder="MM/YY"
              />
            </View>
          </View>

          <View style={{ width: SIZES.width / 2.4 }}>
            <ReusableText
              text={"CVC"}
              family={"regular"}
              size={TEXT.medium}
              color={COLORS.black}
            />
            <HeightSpacer height={10} />

            <View style={styles.inputStyle}>
              <TextInput
                style={styles.searchInput}
                value={searchKey}
                onChangeText={setSearchKey}
                placeholder="000"
              />
            </View>
          </View>
        </View>
       
      </View>

        
      <View>
      <View style={{ position: "absolute",alignItems: "center", right: 0, left: 0, top: 40}}>
          <ReusableBtn
            btnText={"Add Card"}
            width={SIZES.width- 60}
            backgroundColor={COLORS.red}
            borderColor={COLORS.red}
            borderWidth={0.5}
            textColor={COLORS.white}
          />
      </View>
      </View>
    </View>
  );
};

export default AddCard;

const styles = StyleSheet.create({
  inputStyle: {
    paddingVertical: 20,
    paddingLeft: 10,
    backgroundColor: COLORS.lightWhite,
    marginRight: SIZES.small,
    borderRadius: SIZES.small,
  },
});
