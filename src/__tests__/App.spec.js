/// <reference types="vitest" />
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { describe, it, expect } from 'vitest'

describe('App.vue', () => {
  it('renders the app logo', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Videoboards')
  })
})