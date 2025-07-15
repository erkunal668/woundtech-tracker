"use client"

import "@testing-library/jest-dom"
import jest from "jest"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return ""
  },
}))

// Mock better-sqlite3
jest.mock("better-sqlite3", () => {
  return jest.fn().mockImplementation(() => ({
    prepare: jest.fn().mockReturnValue({
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn(),
    }),
    pragma: jest.fn(),
    exec: jest.fn(),
  }))
})
