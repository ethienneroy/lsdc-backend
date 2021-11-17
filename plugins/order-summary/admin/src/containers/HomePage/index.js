/*
 *
 * HomePage
 *
 */

import React, {memo, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";


const moment = require('moment')

const getBgColor = (status) => {
  switch (status) {
    case 'paid':
      return 'white'
    case 'preparation':
      return '#1BC4D7'
    case 'delivery':
      return '#99CF8B'
    default:
      return 'white'
  }
}

function Row(props) {
  // const {row: order} = props;
  const [open, setOpen] = React.useState(false);
  const [cart, setCart] = React.useState(null);

  const [order, setOrder] = useState(props.row)

  const getCartItems = async () => {
    return fetch(`http://localhost:1337/carts/${order.cart.id}`)
      .then((res) => {
        // console.log(res)
        return res.json()
      })
      .then((r) => {
        return r
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(async () => {
    const a = await getCartItems()
    setCart(a)
  }, [])

  const [newStatus, setNewStatus] = useState(order.status)

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value)
  }

  const [displaySaveButton, setDisplaySaveButton] = useState(false)

  useEffect(() => {
    if(newStatus !== order.status) {
      setDisplaySaveButton(true)
    } else {
      setDisplaySaveButton(false)
    }
  }, [newStatus])

  const updateStatus = () => {
    const data = order.cart
    data.status = newStatus;
    return fetch(`http://localhost:1337/orders/${order.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)})
      .then((res) => {
        // console.log(res)
        return res.json()
      })
      .then((r) => {
        setOrder(r)
        setDisplaySaveButton(false)
        setNewStatus(r.status)
        return r
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <React.Fragment>
      <TableRow
        style={{backgroundColor: getBgColor(order.status)}} sx={{'& > *': {borderBottom: 'unset'}}}
        // onClick={() => setOpen(!open)}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="medium"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
          </IconButton>
        </TableCell>
        <TableCell style={{fontSize: '16px'}} component="th" scope="row">{order.cart.email}</TableCell>
        <TableCell style={{fontSize: '16px'}} align="left">{order.cart.address}</TableCell>
        <TableCell style={{fontSize: '16px'}} align="left">{order.cart.firstName} {order.cart.lastName}</TableCell>
        <TableCell style={{fontSize: '16px'}} align="left">{order.total.toFixed(2)}$</TableCell>
        <TableCell style={{fontSize: '16px'}} align="left">{moment(order.created_at).format('LLL')}</TableCell>
        <TableCell style={{fontSize: '16px'}} align="left">
          {/*{order.status}*/}
          <FormControl fullWidth>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>

            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={order.status}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value={'paid'}>Payée</MenuItem>
              <MenuItem value={'preparation'}>En préparation</MenuItem>
              <MenuItem value={'delivery'}>En livraison</MenuItem>
            </Select>
            {displaySaveButton && <Button onClick={updateStatus} variant={'contained'} style={{backgroundColor: '#A21BF9'}} type={"submit"}>Mettre à jour</Button>}
            </div>
          </FormControl>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{paddingBottom: 0, paddingTop: 0, fontSize: '15px'}} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{margin: 1}}>
              <Typography variant="h6" gutterBottom component="div">
                Produits
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell style={{fontSize: '16px', fontWeight: 'bold'}}>ID</TableCell>
                    <TableCell style={{fontSize: '16px', fontWeight: 'bold'}}>Nom</TableCell>
                    <TableCell style={{fontSize: '16px', fontWeight: 'bold'}}>Description</TableCell>
                    <TableCell style={{fontSize: '16px', fontWeight: 'bold'}}>Quantité</TableCell>
                    <TableCell style={{fontSize: '16px', fontWeight: 'bold'}} align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.products && cart && cart.cart_items.map((item) => {
                    const product = props.products.filter((p) => p.id === item.product)[0]
                    return (
                      <TableRow key={item.id}>
                        <TableCell style={{fontSize: '16px'}} component="th" scope="row">
                          {item.product}
                        </TableCell>
                        <TableCell style={{fontSize: '16px'}}>{product.title}</TableCell>
                        <TableCell style={{fontSize: '16px'}}>{product.subtitle}</TableCell>
                        <TableCell style={{fontSize: '16px'}}>{item.count}</TableCell>
                        <TableCell style={{fontSize: '16px'}} align="right"><a href={product.pictures[0].url}><img
                          width={'100px'} height={'100px'} src={product.pictures[0].url}/></a></TableCell>
                        {/*<TableCell style={{fontSize: '16px'}} align="right">*/}
                        {/*  {Math.round(historyRow.amount * order.price * 100) / 100}*/}
                        {/*</TableCell>*/}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
//   createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
//   createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
//   createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
// ];

function HomePage() {
  const [orders, setOrders] = useState(null)

  //
  // const getOrders = async() => {
  //   return fetch('http://localhost:1337/orders')
  //     .then((res) => {
  //       // console.log(res)
  //       return res.json()
  //     })
  //     .then((r) => {
  //       console.log('here ', r)
  //       return r
  //       setOrders(r)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }
  // // console.log(globalContext)
  // useEffect(async() => {
  //   getOrders()
  // }, [])

  useEffect(() => {
    const url = "http://localhost:1337/orders";

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json)
        setOrders(json);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, []);

  const [products, setProducts] = useState(null)


  const getProducts = async () => {
    return fetch('http://localhost:1337/products')
      .then((r) => r.json())
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(async () => {
    setProducts(await getProducts())

  }, [])


  return (
    <div className="order-container" style={{padding: '20px'}}>
      <h1>Liste des commandes</h1>
      <TableContainer style={{marginTop: '50px', fontSize: '22px'}} component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell/>
              <TableCell style={{fontSize: '16px', fontWeight: 'bold'}}>Courriel</TableCell>
              <TableCell style={{fontSize: '16px', fontWeight: 'bold'}}>Addresse</TableCell>
              <TableCell style={{fontSize: '16px', fontWeight: 'bold'}}>Client</TableCell>
              <TableCell style={{fontSize: '16px', fontWeight: 'bold'}} align="left">Total</TableCell>
              <TableCell style={{fontSize: '16px', fontWeight: 'bold'}} align="left">Date de création</TableCell>
              <TableCell style={{fontSize: '16px', fontWeight: 'bold'}} align="left">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/*{orders && orders.map((order) => {*/}
            {/*  return <div>{order.cart.email}</div>*/}
            {/*})}*/}
            {orders && orders.map((row) => (
              <Row key={row.name} row={row} products={products}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default memo(HomePage);
