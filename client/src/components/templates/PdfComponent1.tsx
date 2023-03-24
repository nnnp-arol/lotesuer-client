import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

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
  headerTitle: {
    marginTop: 60,
    fontSize: 24,
    fontWeight: "100",
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
  bodyTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  contBodyText: {
    width: 300,
  },
  bodyText: {
    marginTop: 7,
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
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

function PdfComponent({ data }) {
  const HeadTh = ({ text, flx }) => {
    return (
      <View
        style={{
          flex: flx,
          marginHorizontal: 1,
          height: 20,
        }}
      >
        <Text style={{ textAlign: "left", fontWeight: "ultrabold" }}>
          {text}
        </Text>
      </View>
    );
  };

  const BodyTd = ({ text, index, flx }) => {
    return (
      <View
        style={{
          flex: flx,
          marginHorizontal: 1,
          backgroundColor: index % 2 === 0 ? "#334155" : "#1e293b",
          color: index % 2 === 0 ? "#9ca3af" : "#d1d5db",
          alignItems: "flex-start",
        }}
      >
        <Text style={{ textAlign: "left" }}>{text}</Text>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4">
        <View style={styles.container}>
          <View style={{ width: "100%", height: "100%" }}>
            <View style={{ width: "95%", margin: "auto", marginTop: 50 }}>
              <View
                style={{
                  flexDirection: "row",
                  fontSize: 8,
                  backgroundColor: "#0f172a",
                  color: "#cbd5e1",
                }}
              >
                <HeadTh flx={0.3} text="fecha" />
                <HeadTh flx={0.2} text="vendedor" />
                <HeadTh flx={0.2} text="quiniela" />
                <HeadTh flx={0.2} text="quini6" />
                <HeadTh flx={0.2} text="loto" />
                <HeadTh flx={0.2} text="loto5" />
                <HeadTh flx={0.2} text="brinco" />
                <HeadTh flx={0.2} text="poceada" />
                <HeadTh flx={0.2} text="express" />
                <HeadTh flx={0.2} text="premios" />
                <HeadTh flx={0.2} text="total" />
                <HeadTh flx={0.2} text="saldo" />
                <HeadTh flx={0.2} text="paga" />
              </View>
              <View style={{ flexDirection: "column" }}>
                {!!data
                  ? data.map((sale, index) => (
                      <View style={{ flexDirection: "row", fontSize: 10 }}>
                        <BodyTd text={sale.date} index={index} flx={0.3} />
                        <BodyTd
                          text={sale.seller.id_seller}
                          index={index}
                          flx={0.2}
                        />
                        <BodyTd
                          text={sale.games.quiniela}
                          index={index}
                          flx={0.2}
                        />
                        <BodyTd
                          text={sale.games.quini6}
                          index={index}
                          flx={0.2}
                        />
                        <BodyTd
                          text={sale.games.loto}
                          index={index}
                          flx={0.2}
                        />
                        <BodyTd
                          text={sale.games.loto5}
                          index={index}
                          flx={0.2}
                        />
                        <BodyTd
                          text={sale.games.brinco}
                          index={index}
                          flx={0.2}
                        />
                        <BodyTd
                          text={sale.games.poceada}
                          index={index}
                          flx={0.2}
                        />
                        <BodyTd
                          text={sale.totals.premios}
                          index={index}
                          flx={0.2}
                        />
                        <BodyTd
                          text={sale.totals.total}
                          index={index}
                          flx={0.2}
                        />
                        <BodyTd
                          text={sale.totals.saldo}
                          index={index}
                          flx={0.2}
                        />
                        <BodyTd
                          text={sale.totals.paga}
                          index={index}
                          flx={0.2}
                        />
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
}

export default PdfComponent;
