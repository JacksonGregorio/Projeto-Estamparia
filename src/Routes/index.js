import express from 'express';
import cors from 'cors';

import helmet from 'helmet';
import User from './UserRoutes.js';
import Auth from './AuthRoutes.js';
import Payment from './PaymentRoutes.js';
import Order from './OrderRoutes.js';
import Client from './ClientRoutes.js';
import Supplier from './SupplierRoutes.js';
import Material from './MaterialRoutes.js';
import Movement from './MovementRoutes.js';
import Product from './ProductRoutes.js';
import Mask from './MaskRoutes.js';



const routes = (app) => {

    app.use(cors({
        origin: '*'
    }));

    app.use(helmet());

    app.route('/').get((req, res) => {
        res.status(200).send('Bem vindo a API :)');
    });

    app.use(
        express.json(),
        Auth,
        Client,
        Payment,
        Order,
        Product,
        Mask,
        Movement,
        Material,
        Supplier,
        User
    );
};

export default routes;