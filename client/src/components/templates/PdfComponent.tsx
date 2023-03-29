import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import moment from "moment";
import { Sale } from "../../utils/interfaces";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  cont1: {
    width: 550,
    height: 500,
    marginHorizontal: "auto",
    alignItems: "center",
  },

  header: {
    marginTop: 30,
  },
  pin: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "extrabold",
  },

  imgTicket: {
    marginTop: 50,
    width: 64,
    height: 64,
  },
  contBodyText: {
    width: 300,
  },
  cont2: {
    width: 590,
    height: 335,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  footerA: {
    width: 190,
    height: 160,
  },
  footerB: {
    width: 119,
    height: 190,
  },
  rowView: {
    flex: 1,
    marginHorizontal: 1,
  },
});

type HeadThPropsType = {
  text: string;
  flx?: number | undefined;
  algn?: string | undefined;
};

type BodyTdPropsType = {
  algn?: string;
  text: string;
  flx?: number;
};

type PdfComponentPropsType = {
  data: Sale[] | undefined;
  startDate: string;
  endDate: string;
};

export const PdfComponent: (props: PdfComponentPropsType) => JSX.Element = ({
  data,
  startDate,
  endDate,
}) => {
  const HeadTh: (props: HeadThPropsType) => JSX.Element = ({
    text,
    flx = 0.2,
    algn = "center",
  }) => {
    return (
      <View
        style={{
          flex: flx,
          height: 10,
        }}
      >
        <Text
          style={{
            textAlign:
              algn === "center"
                ? "center"
                : algn === "right"
                ? "right"
                : "left",
            fontWeight: "heavy",
          }}
        >
          {text}
        </Text>
      </View>
    );
  };

  const BodyTd: (props: BodyTdPropsType) => JSX.Element = ({
    text,
    flx = 0.2,
    algn = "center",
  }) => {
    return (
      <View
        style={{
          flex: flx,
          color: "black",
        }}
      >
        <Text
          style={{
            textAlign:
              algn === "center"
                ? "center"
                : algn === "right"
                ? "right"
                : "left",
          }}
        >
          {text}
        </Text>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4">
        <View style={styles.container}>
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <View style={{ width: "40%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: 35 }}>
                    <Text style={{ fontSize: 10, textDecoration: "underline" }}>
                      Desde:
                    </Text>
                  </View>
                  <Text style={{ fontSize: 8, marginLeft: 2 }}>
                    {moment(startDate).format("DD-MM-YYYY")}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: 35 }}>
                    <Text style={{ fontSize: 10, textDecoration: "underline" }}>
                      Hasta:
                    </Text>
                  </View>
                  <Text style={{ fontSize: 8, marginLeft: 2 }}>
                    {moment(endDate).format("DD-MM-YYYY")}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ marginTop: 10 }}>Lotesuer</Text>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                margin: "auto",
                marginTop: 30,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  fontSize: 8,
                  borderBottomWidth: 1,
                }}
              >
                <HeadTh flx={0.3} text="Fecha" algn="left" />
                <HeadTh text="Vendedor" algn="left" />
                <HeadTh text="Quiniela" />
                <HeadTh text="Quini6" />
                <HeadTh text="Loto" />
                <HeadTh text="Loto5" />
                <HeadTh text="Brinco" />
                <HeadTh text="Poceada" />
                <HeadTh text="Express" />
                <HeadTh text="Premios" />
                <HeadTh text="Total" />
                <HeadTh text="Paga" />
                <HeadTh text="Saldo" algn="right" />
              </View>
              <View style={{ flexDirection: "column" }}>
                {!!data
                  ? data.map((sale, index) => (
                      <View
                        style={{
                          flexDirection: "row",
                          fontSize: 8,
                          borderBottomWidth: 1,
                          paddingVertical: 1,
                        }}
                      >
                        <BodyTd
                          text={moment(sale.date).format("DD-MM-YYYY")}
                          flx={0.3}
                          algn="left"
                        />
                        <BodyTd text={sale.seller.id_seller} algn="left" />
                        <BodyTd text={sale.games.quiniela} />
                        <BodyTd text={sale.games.quini6} />
                        <BodyTd text={sale.games.loto} />
                        <BodyTd text={sale.games.loto5} />
                        <BodyTd text={sale.games.brinco} />
                        <BodyTd text={sale.games.poceada} />
                        <BodyTd text={sale.games.express} />
                        <BodyTd text={sale.totals.premios} />
                        <BodyTd text={sale.totals.total} />
                        <BodyTd text={sale.totals.paga} />
                        <BodyTd text={sale.totals.saldo} algn="right" />
                      </View>
                    ))
                  : null}
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
