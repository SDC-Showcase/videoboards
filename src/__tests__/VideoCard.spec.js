/// <reference types="vitest" />
import { mount } from '@vue/test-utils'
import VideoCard from '../components/VideoCard.vue'
import { describe, it, expect } from 'vitest'

describe('VideoCard.vue', () => {
  it('renders an iframe with the correct src', () => {
    const videoUrl = 'https://www.youtube.com/embed/testid';
    const wrapper = mount(VideoCard, {
      props: { id: 'card1', videoUrl }
    })
    const iframe = wrapper.find('iframe');
    expect(iframe.exists()).toBe(true);
    expect(iframe.attributes('src')).toBe(videoUrl);
  })
})