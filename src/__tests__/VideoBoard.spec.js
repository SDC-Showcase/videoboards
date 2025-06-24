/// <reference types="vitest" />
import { mount } from '@vue/test-utils'
import VideoBoard from '../components/VideoBoard.vue'
import { describe, it, expect } from 'vitest'

describe('VideoBoard.vue', () => {
  it('renders with the given name', () => {
    const wrapper = mount(VideoBoard, {
      props: { name: 'TestBoard', isActive: true }
    })
    expect(wrapper.html()).toContain('panel-TestBoard')
  })
})