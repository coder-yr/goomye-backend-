import {
  Box,
  CheckBox,
  H2,
  H5,
  Link,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
  Text,
} from "@adminjs/design-system";
import { useEffect, useState } from "react";
// import { serverUrl } from "../constants";
function DashboardComponent() {
  // const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({
    todayOrders: 0,
    createdOrders: 0,
    acceptedOrders: 0,
    readyToShip: 0,
    inTransist: 0,
  });
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    // async function fetchCounts() {
    //   const res = await fetch(serverUrl, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       query: `
    //         query GetDashboardData {
    //           getDashboardData {
    //             mainDesktop
    //             barcodeDesktop
    //             manufactureDesktop
    //             jewelleryDesktop
    //             hrmDesktop
    //             mainMobile
    //             barcodeMobile
    //             manufactureMobile
    //             jewelleryMobile
    //             hrmMobile
    //           }
    //         }
    //       `,
    //     }),
    //   });
    //   const json = await res.json();
    //   setCounts(json.data.getDashboardData);
    // }
    // fetchCounts();

    async function fetchRecentOrders() {
      const res = await fetch(
        `/api/resources/orders/actions/list?direction=desc&sortBy=orderId&page=1`
      );
      console.log(res);

      const json = await res.json();
      setOrders(json.records);
    }

    fetchRecentOrders();
  }, []);

  return (
    <Box variant="grey">
      <Box
        display="flex-column"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="xl"
      >
        <H2>Welcome to GOOMYE</H2>

        {/* DESKTOP STATS */}
        <H5>Order Stats</H5>
        <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap="lg">
          <Box
            padding="xl"
            backgroundColor="white"
            borderRadius="lg"
            boxShadow="card"
            textAlign="center"
            marginRight="xl"
          >
            <Text fontSize="lg" fontWeight="bold" marginBottom="md">
              Today's New Orders
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="primary100">
              {counts.todayOrders}
            </Text>
          </Box>

          <Box
            padding="xl"
            backgroundColor="white"
            borderRadius="lg"
            boxShadow="card"
            textAlign="center"
            marginRight="xl"
          >
            <Text fontSize="lg" fontWeight="bold" marginBottom="md">
              Pending Orders
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="primary100">
              {counts.createdOrders}
            </Text>
          </Box>
          <Box
            padding="xl"
            backgroundColor="white"
            borderRadius="lg"
            boxShadow="card"
            textAlign="center"
            marginRight="xl"
          >
            <Text fontSize="lg" fontWeight="bold" marginBottom="md">
              Accepted Orders
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="primary100">
              {counts.acceptedOrders}
            </Text>
          </Box>
          <Box
            padding="xl"
            backgroundColor="white"
            borderRadius="lg"
            boxShadow="card"
            textAlign="center"
            marginRight="xl"
          >
            <Text fontSize="lg" fontWeight="bold" marginBottom="md">
              Ready To Ship
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="primary100">
              {counts.readyToShip}
            </Text>
          </Box>
          <Box
            padding="xl"
            backgroundColor="white"
            borderRadius="lg"
            boxShadow="card"
            textAlign="center"
          >
            <Text fontSize="lg" fontWeight="bold" marginBottom="md">
              In Transist
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="primary100">
              {counts.inTransist}
            </Text>
          </Box>
        </Box>

        {orders !== null && (
          <Box marginTop="100px">
            <Table>
              <TableCaption>
                <Text as="span">RECENT ORDERs</Text>
              </TableCaption>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <CheckBox />
                  </TableCell>
                  <TableCell onClick={function noRefCheck() {}}>
                    <Link href="/">OrderId</Link>
                  </TableCell>
                  <TableCell onClick={function noRefCheck() {}}>
                    <Link href="/">Status</Link>
                  </TableCell>
                  <TableCell onClick={function noRefCheck() {}}>
                    <Link href="/">CustomerId</Link>
                  </TableCell>
                  <TableCell onClick={function noRefCheck() {}}>
                    <Link href="/">AddressId</Link>
                  </TableCell>
                  <TableCell onClick={function noRefCheck() {}}>
                    <Link href="/">Total</Link>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((order) => {
                  return (
                    <TableRow key={order}>
                      <TableCell>
                        <CheckBox />
                      </TableCell>
                      <TableCell>{order.params.orderId}</TableCell>
                      <TableCell className="adminjs_Badge">
                        {order.params.status}
                      </TableCell>
                      <TableCell>{order.params.customerId}</TableCell>
                      <TableCell>{order.params.addressId}</TableCell>
                      <TableCell>{order.params.total}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default DashboardComponent;
