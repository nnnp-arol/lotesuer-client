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
  game: string;
};

export const PdfComponent: (props: PdfComponentPropsType) => JSX.Element = ({
  data,
  startDate,
  endDate,
  game,
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: 35 }}>
                    <Text style={{ fontSize: 10, textDecoration: "underline" }}>
                      juego:
                    </Text>
                  </View>
                  <Text style={{ fontSize: 8, marginLeft: 2 }}>{game}</Text>
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
                {game === "quiniela" ? (
                  <>
                    <HeadTh text="Fecha" algn="left" flx={0.1} />
                    <HeadTh text="Vendedor" algn="left" flx={0.1} />
                    <HeadTh text="Quiniela" algn="left" flx={0.1} />
                    <HeadTh text="Quini6" algn="left" flx={0.1} />
                    <HeadTh text="Loto" algn="left" flx={0.1} />
                    <HeadTh text="Loto5" algn="left" flx={0.1} />
                    <HeadTh text="Brinco" algn="left" flx={0.1} />
                    <HeadTh text="Poceada" algn="left" flx={0.1} />
                    <HeadTh text="Express" algn="left" flx={0.1} />
                    <HeadTh text="Premios" algn="left" flx={0.1} />
                    <HeadTh text="Total" algn="left" flx={0.1} />
                    <HeadTh text="Paga" algn="left" flx={0.1} />
                    <HeadTh text="Saldo" algn="left" flx={0.1} />
                  </>
                ) : (
                  <>
                    <HeadTh text="Fecha sorteo" flx={1} algn="left" />
                    <HeadTh text="Sorteo" flx={1} algn="left" />
                    <HeadTh text="Vendedor" flx={1} algn="left" />
                    <HeadTh text="Cartones" flx={1} algn="left" />
                    <HeadTh text="Devolucion" flx={1} algn="left" />
                    <HeadTh text="Paga" flx={1} algn="left" />
                    <HeadTh text="Saldo" flx={1} algn="left" />
                  </>
                )}
              </View>
              <View style={{ flexDirection: "column" }}>
                {!!data
                  ? data.map((sale: any, index: number) => (
                      <View
                        key={sale._id}
                        style={{
                          flexDirection: "row",
                          fontSize: 8,
                          borderBottomWidth: 1,
                          paddingVertical: 1,
                        }}
                      >
                        {game === "quiniela" ? (
                          <>
                            <BodyTd
                              text={moment(sale?.date).format("DD-MM-YY")}
                              algn="left"
                              flx={0.1}
                            />
                            <BodyTd
                              text={sale?.seller?.id_seller}
                              algn="left"
                              flx={0.1}
                            />
                            <BodyTd
                              text={sale?.games?.quiniela}
                              algn="left"
                              flx={0.1}
                            />
                            <BodyTd
                              text={sale?.games?.quini6}
                              algn="left"
                              flx={0.1}
                            />
                            <BodyTd
                              text={sale?.games?.loto}
                              algn="left"
                              flx={0.1}
                            />
                            <BodyTd
                              text={sale?.games?.loto5}
                              algn="left"
                              flx={0.1}
                            />
                            <BodyTd
                              text={sale?.games?.brinco}
                              algn="left"
                              flx={0.1}
                            />
                            <BodyTd
                              text={sale?.games?.poceada}
                              algn="left"
                              flx={0.1}
                            />
                            <BodyTd
                              text={sale?.games?.express}
                              algn="left"
                              flx={0.1}
                            />
                            <BodyTd
                              text={sale?.totals?.premios}
                              algn="left"
                              flx={0.1}
                            />
                            <BodyTd
                              text={sale?.totals?.total}
                              algn="left"
                              flx={0.1}
                            />
                            <BodyTd
                              text={sale?.totals?.paga}
                              algn="left"
                              flx={0.1}
                            />
                            <BodyTd
                              text={sale?.totals?.saldo}
                              algn="left"
                              flx={0.1}
                            />
                          </>
                        ) : (
                          <>
                            <BodyTd
                              text={moment(sale?.fecha_sorteo).format(
                                "DD-MM-YY"
                              )}
                              flx={1}
                              algn="left"
                            />
                            <BodyTd text={sale?.sorteo} flx={1} algn="left" />
                            <BodyTd
                              text={sale?.seller.id_seller}
                              flx={1}
                              algn="left"
                            />
                            <BodyTd text={sale?.cartones} flx={1} algn="left" />
                            <BodyTd
                              text={sale?.devolucion}
                              flx={1}
                              algn="left"
                            />
                            <BodyTd text={sale?.paga} flx={1} algn="left" />
                            <BodyTd text={sale?.saldo} flx={1} algn="left" />
                          </>
                        )}
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
