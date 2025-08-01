/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute, createRootRoute } from '@tanstack/react-router'

// Import the component files

import { Route as rootRoute } from './routes/__root'
import { Route as AuthRoute } from './routes/auth'
import { Route as AuthProviderLoginRoute } from './routes/auth/provider-login'
import { Route as AuthProviderRegisterRoute } from './routes/auth/provider-register'
import { Route as AuthPatientLoginRoute } from './routes/auth/patient-login'

// Create the route tree

export const routeTree = rootRoute.addChildren([
  AuthRoute.addChildren([
    AuthProviderLoginRoute,
    AuthProviderRegisterRoute,
    AuthPatientLoginRoute,
  ]),
])

/* prettier-ignore-end */ 