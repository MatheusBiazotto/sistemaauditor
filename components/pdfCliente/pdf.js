"use client";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    fontSize: 12,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "justify",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  link: {
    color: "#0000FF",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 600,
  },
  sublinhedText: {
    textDecoration: "underline",
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold !important",
  },
  italicText: {
    fontStyle: "italic !important",
  },
  viewDefault: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
});

export default function PdfCliente({ dados }) {
  return (
    <Document>
      {dados.produtos.map((produto) => (
        <Page key={produto.key} size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>
              Resultado da Avaliação do Produto: {produto.tipoProduto}
            </Text>
            <View
              style={{
                display: "flex",
                gap: "20px",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Realizado pelo Consultor: {dados.consultor}</Text>
              <Text>Cliente: {dados.nomeCliente}</Text>
              <Text>Data: {dados.data}</Text>
            </View>
            <View
              style={{ display: "flex", flexDirection: "row", gap: "12px" }}
            >
              <View style={{ width: "70%" }}>
                <Text>
                  Prezado cliente, temos o prazer de apresentar os resultados da
                  avaliação realizada em seu lote de Papel Toalha Interfolhado.
                  Nossa análise visa oferecer insights valiosos para a
                  otimização de suas escolhas em relação a custo e benefício,
                  sem a intenção de depreciar marcas ou fornecedores. Para
                  entender mais assista
                  <Text style={styles.link}>
                    {" "}
                    https://www.youtube.com/watch?v=LCDtUe8uk1M
                  </Text>{" "}
                  ou através do QRCODE:
                </Text>
              </View>
              <View>
                <Image
                  style={{ width: "100px" }}
                  src="/qrcode.png"
                  alt="QRCode"
                />
              </View>
            </View>
            <View style={styles.viewDefault}>
              <Text style={styles.subtitle}>Detalhes da Avaliação:</Text>
              <Text>Produto avaliado: {produto.tipoProduto}</Text>
              <Text>Marca avaliada: {produto.marcaProduto}</Text>
              <Text>
                Metragem informada na embalagem: {produto.qtdFolhasRolos}{" "}
                Folhas/Rolos
              </Text>
              <Text>
                Metragem Verificada Após nossa Pesagem: {produto.metragemReal}{" "}
                Folhas/Rolos
              </Text>
            </View>
            <View style={styles.viewDefault}>
              <Text>
                <Text style={styles.boldText}>Resultado Final:</Text> (Quando
                falta) observou-se uma discrepância entre a quantidade de folhas
                informada e a quantidade de folhas real, com uma diferença de
                xxxx folhas cada fardo, correspondendo a uma redução de xx% em
                relação ao esperado.
              </Text>
              <Text>
                Considerando a compra mensal de {produto.qtdFardos} fardos, cada
                fardo contendo {produto.qtdFolhasRolos} folhas, esta diferença
                resulta em uma perda faltante de XXX folhas de papel a cada
                compra.
              </Text>
              <Text>
                <Text style={styles.boldText}>Resultado Final:</Text> (Quando
                OK) Observou-se que o produto cumpre integralmente com
                quantidade de folhas informadas na embalagem, dentro de uma
                margem de tolerância reconhecida e permitida pelo Instituto de
                Pesos e Medidas (IPEM).
              </Text>
            </View>
            <View style={styles.viewDefault}>
              <Text>
                <Text style={styles.boldText}>Metodologia:</Text> A análise foi
                conduzida por meio de pesagem, uma metodologia com{" "}
                <Text style={styles.sublinhedText}>95% de assertividade</Text>,
                baseada nas medidas e quantidade de folhas indicados na
                embalagem do produto da marca {produto.marcaProduto}.
              </Text>
              <Text>
                <Text style={styles.boldText}>Verificação Independente:</Text>{" "}
                Encorajamos nossos clientes, que realize sua própria verificação
                independentemente dos resultados aqui apresentado, para sua
                total confiança. A contagem direta do produto através da pratica
                simples de (Contagem de folhas por pacote) pode ser realizada
                para comprovar 100% de assertividade.
              </Text>
            </View>
            <View style={styles.viewDefault}>
              <Text>
                <Text style={styles.boldText}>Nota Importante:</Text> A Art Limp
                Brasil não se posiciona como um órgão oficial de medição ou
                pesagem. Nossa missão é auxiliar nossos clientes através de
                alertas construtivos, possibilitando a identificação da melhor
                relação custo-benefício em produtos sanitários. Para
                verificações oficiais, recomendamos o contato com o Instituto de
                Pesos e Medidas (IPEM).
              </Text>
            </View>
            <View style={styles.viewDefault}>
              <Text>Atenciosamente,</Text>
              <Text style={styles.link}>www.artlimpbrasil.com.br</Text>
              <Text style={styles.italicText}>
                Auxiliando na busca pela excelência e transparência em produtos
                sanitários.
              </Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}
