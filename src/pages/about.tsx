import * as React from "react";
import { Card, CardContent, Container, Divider, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import WebViewNavbar from "@/common/LayoutNavigations/webviewnavbar";
import WebViewFooter from "@/common/LayoutNavigations/webviewfooter";
import styles from "../styles/webview.module.css";
import { GetAllSubsctionPlans } from "@/services/subscription";
import Image from "next/image";

export default function HomePage() {
  const [subsdata, setsubsdata] = React.useState([]);
  React.useEffect(() => {
    getSubscribtion();
  }, []);

  //get subscription
  const getSubscribtion = () => {
    GetAllSubsctionPlans().then((subscdata) => {
      setsubsdata(subscdata);
    });
  };

  return (
    <>
      {/*header*/}
      <WebViewNavbar />
      <Box>
        <Container maxWidth={false} className={styles.imgwidthcss}>
          <Grid>
            <Image
              src="/Images/sideImages/aboutUs.jpg"
              alt="image"
              width={100}
              height={300}
              className={styles.imagecssbanner}
            />
          </Grid>
        </Container>
      </Box>
      <Box className={styles.aboutHeading}>
        <Container maxWidth="lg">
          <Box className={styles.headerbox}>
            <Typography variant="h6" gutterBottom className={styles.h6}>
              About Us
            </Typography>
            <Divider className={styles.divderabout} />
          </Box>
          <Box className={styles.aboutsiteBodyContainer}>
            <Card>
              <CardContent>
                <Typography variant="body1" style={{ textAlign: "justify" }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                  incidunt rerum tempora, neque harum, consectetur at deserunt,
                  reprehenderit expedita repudiandae provident voluptatibus
                  nobis? Doloremque optio, doloribus dolorem facilis sit vel
                  laboriosam, at dolor molestiae qui voluptatum sunt, ea rerum
                  quisquam ipsum fuga! Ipsa, nisi rem in labore consequuntur
                  eius et?Lorem ipsum dolor, sit amet consectetur adipisicing
                  elit. Dolor possimus recusandae cumque tenetur cupiditate
                  voluptate perspiciatis consequatur nemo in, quia, sint
                  distinctio, debitis repellendus maiores exercitationem
                  excepturi quas officiis provident quaerat nam! Odit alias hic
                  maxime quasi amet dignissimos? Rerum omnis officia ut optio
                  pariatur id eligendi eius maxime, nisi error facilis veniam
                  inventore perspiciatis consequatur. Fuga voluptatum eaque
                  quidem enim, nobis perspiciatis iure ab qui obcaecati quis,
                  aliquam voluptates velit blanditiis iusto, ullam impedit
                  asperiores! Natus iusto quae sint earum pariatur, veritatis
                  assumenda qui, asperiores error culpa nesciunt fugit minus
                  facere, debitis obcaecati maiores? Cumque distinctio
                  laudantium deserunt nesciunt minima nemo harum asperiores,
                  quae excepturi quam corrupti corporis at ab vitae possimus
                  rerum voluptate exercitationem eaque inventore quod
                  consequuntur. Ipsum et fuga modi officiis nemo, minus animi
                  aliquam aut earum sint delectus consectetur. Nostrum fuga
                  perspiciatis error illum dolor. Doloribus perferendis
                  voluptatem quidem eligendi quas consequatur. Ducimus nostrum
                  natus deleniti fugit! Veritatis dicta molestias ab neque
                  placeat architecto mollitia quam et sunt autem non unde vel
                  suscipit accusantium itaque, odio veniam consectetur quis
                  reprehenderit voluptatem. Sit dolore consequatur magnam,
                  doloribus, vitae iure numquam adipisci, corrupti cupiditate
                  omnis laudantium odio. Aspernatur tempora quaerat iste dolor
                  vero voluptates, suscipit molestias animi perspiciatis nobis
                  debitis quis id, ducimus illo minima similique optio harum
                  itaque eligendi quas dolorem exercitationem? Accusamus ipsam
                  quas iste dolores iure assumenda, laboriosam ducimus quod,
                  facilis repudiandae dolor reiciendis error, et tempore? Fugit
                  magni fuga perferendis, autem ipsam, tempore nisi at non
                  maxime asperiores accusamus sequi laudantium. Amet nihil sit
                  numquam praesentium, inventore non animi ad est eius nobis
                  sapiente adipisci voluptate provident doloremque, accusamus
                  reiciendis illo rerum, facere ea iusto laudantium! Repudiandae
                  consequuntur vel neque incidunt provident non consequatur
                  consectetur sunt ratione, impedit eligendi nobis obcaecati
                  reprehenderit autem reiciendis pariatur dolor fugit rerum
                  cumque nisi dolores iusto facere. Exercitationem soluta,
                  blanditiis vitae delectus molestias sed quia officia
                  consequatur iste sit ducimus, id fuga recusandae neque iure
                  placeat perspiciatis quas! Tenetur, veniam quam aut officiis
                  molestiae non velit dolores perspiciatis itaque cupiditate.
                  Culpa optio veritatis fugit accusantium officia vitae tempore
                  qui delectus odio iusto voluptates non error magnam ratione
                  autem molestiae pariatur magni eius, deleniti repudiandae a
                  accusamus mollitia. Omnis commodi esse molestias ipsa
                  voluptatum tempore est ea necessitatibus laboriosam, facere
                  quod rerum, id sint quae! Debitis sunt doloremque vel eos
                  tenetur incidunt blanditiis maxime, voluptate illum, nulla rem
                  sed iure laboriosam aliquid! Ad dolore numquam sapiente
                  commodi in quod voluptas sit veniam tenetur labore nulla qui
                  quidem enim ut porro, recusandae nesciunt distinctio expedita
                  maiores omnis adipisci voluptatibus alias. Dolores molestias
                  illum ullam, voluptatibus est natus sunt. Quae odio labore
                  optio atque officiis natus delectus cupiditate aspernatur
                  architecto maiores quaerat mollitia recusandae vitae
                  necessitatibus sit alias, laboriosam voluptatem, perspiciatis
                  minus pariatur quisquam aut inventore! Accusamus cumque
                  laboriosam eligendi fugit corrupti magnam suscipit corporis
                  officiis, sit nemo, sequi a debitis adipisci architecto ut
                  quod ab beatae? Voluptates, magnam libero porro totam eum
                  delectus perspiciatis natus quaerat veritatis velit ducimus
                  facilis, expedita fuga ratione, obcaecati incidunt rerum
                  facere quasi nemo?
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      <WebViewFooter />
    </>
  );
}
