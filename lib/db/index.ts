/**
 * Database Adapter Factory
 *
 * This module provides a factory function to get the appropriate database adapter
 * based on environment configuration.
 *
 * Set the DATABASE_ADAPTER environment variable to choose an adapter:
 * - "memory" (default) - In-memory storage for demo/testing
 * - "prisma-postgres" - PostgreSQL with Prisma (requires: pnpm install prisma @prisma/client)
 * - "prisma-mysql" - MySQL with Prisma (requires: pnpm install prisma @prisma/client)
 * - "prisma-sqlite" - SQLite with Prisma (requires: pnpm install prisma @prisma/client)
 * - "supabase" - Supabase (PostgreSQL, requires: pnpm install prisma @prisma/client)
 * - "planetscale" - PlanetScale (MySQL, requires: pnpm install prisma @prisma/client)
 * - "mongodb" - MongoDB (requires: pnpm install mongodb)
 *
 * To use a non-memory adapter:
 * 1. Install the required package (see above)
 * 2. Set DATABASE_ADAPTER environment variable
 * 3. Uncomment the corresponding case in getAdapter() below
 */

import type { AuthAdapter } from './adapter'

// Adapter type enum
export type AdapterType =
  | 'memory'
  | 'prisma-postgres'
  | 'prisma-mysql'
  | 'prisma-sqlite'
  | 'supabase'
  | 'planetscale'
  | 'mongodb'

// Singleton instance
let adapterInstance: AuthAdapter | null = null

/**
 * Get the database adapter based on environment configuration.
 * Uses singleton pattern to ensure only one adapter instance exists.
 *
 * NOTE: To enable additional adapters, uncomment their case blocks below
 * after installing the required packages.
 */
export async function getAdapter(): Promise<AuthAdapter> {
  if (adapterInstance) {
    return adapterInstance
  }

  const adapterType = (process.env.DATABASE_ADAPTER || 'memory') as AdapterType

  switch (adapterType) {
    case 'memory': {
      const { memoryAdapter } = await import('./adapters/memory')
      adapterInstance = memoryAdapter
      break
    }

    // Uncomment after installing: pnpm install prisma @prisma/client
    // case 'prisma-postgres': {
    //   const { prismaPostgresAdapter } = await import('./adapters/prisma-postgres')
    //   adapterInstance = prismaPostgresAdapter
    //   break
    // }

    // Uncomment after installing: pnpm install prisma @prisma/client
    // case 'prisma-mysql': {
    //   const { prismaMysqlAdapter } = await import('./adapters/prisma-mysql')
    //   adapterInstance = prismaMysqlAdapter
    //   break
    // }

    // Uncomment after installing: pnpm install prisma @prisma/client
    // case 'prisma-sqlite': {
    //   const { prismaSqliteAdapter } = await import('./adapters/prisma-sqlite')
    //   adapterInstance = prismaSqliteAdapter
    //   break
    // }

    // Uncomment after installing: pnpm install prisma @prisma/client
    // case 'supabase': {
    //   const { supabaseAdapter } = await import('./adapters/supabase')
    //   adapterInstance = supabaseAdapter
    //   break
    // }

    // Uncomment after installing: pnpm install prisma @prisma/client
    // case 'planetscale': {
    //   const { planetscaleAdapter } = await import('./adapters/planetscale')
    //   adapterInstance = planetscaleAdapter
    //   break
    // }

    // Uncomment after installing: pnpm install mongodb
    // case 'mongodb': {
    //   const { mongodbAdapter } = await import('./adapters/mongodb')
    //   adapterInstance = mongodbAdapter
    //   break
    // }

    default:
      // Fall back to memory adapter if unknown or adapter not enabled
      console.warn(`Database adapter "${adapterType}" is not enabled. Using memory adapter.`)
      console.warn('See lib/db/index.ts for instructions on enabling additional adapters.')
      const { memoryAdapter } = await import('./adapters/memory')
      adapterInstance = memoryAdapter
  }

  return adapterInstance
}

/**
 * Get the current adapter type from environment
 */
export function getAdapterType(): AdapterType {
  return (process.env.DATABASE_ADAPTER || 'memory') as AdapterType
}

/**
 * Check if running in demo mode (in-memory adapter)
 */
export function isDemoMode(): boolean {
  return getAdapterType() === 'memory'
}

/**
 * Reset the adapter instance (useful for testing)
 */
export function resetAdapter(): void {
  adapterInstance = null
}

// Re-export types
export type { AuthAdapter } from './adapter'
export type { User, CreateUserInput, UpdateUserInput, TokenData, UserForAuth, PublicUser } from './types'
