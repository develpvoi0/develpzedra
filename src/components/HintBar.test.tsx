import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HintBar } from './HintBar'
import { bus } from '../engine/bus'

describe('HintBar', () => {
  afterEach(() => vi.restoreAllMocks())

  it('renderiza todos los chips de comandos', () => {
    render(<HintBar />)
    for (const cmd of ['whoami', 'history', 'infra', 'projects', 'stack', 'contact', 'tired']) {
      expect(screen.getByRole('button', { name: cmd })).toBeInTheDocument()
    }
  })

  it('emite el comando en el bus al hacer click en un chip', async () => {
    const emit = vi.spyOn(bus, 'emit')
    const user = userEvent.setup()
    render(<HintBar />)

    await user.click(screen.getByRole('button', { name: 'projects' }))

    expect(emit).toHaveBeenCalledWith('projects')
  })
})
