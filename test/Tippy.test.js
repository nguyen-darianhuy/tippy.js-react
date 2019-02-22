import React from 'react'
import Tippy from '../src/Tippy'
import ReactDOMServer from 'react-dom/server'
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('<Tippy />', () => {
  test('renders only the child element', () => {
    const stringContent = render(
      <Tippy content="tooltip">
        <button />
      </Tippy>,
    )
    expect(stringContent.container.innerHTML).toBe('<button></button>')
    const reactElementContent = render(
      <Tippy content={<div>tooltip</div>}>
        <button />
      </Tippy>,
    )
    expect(reactElementContent.container.innerHTML).toBe('<button></button>')
  })

  test('adds a tippy instance to the child node', () => {
    const { container } = render(
      <Tippy content="tooltip">
        <button />
      </Tippy>,
    )
    expect(container.querySelector('button')._tippy).toBeDefined()
  })

  test('calls onCreate() on mount, passing the instance back', () => {
    const spy = jest.fn()
    render(
      <Tippy content="tooltip" onCreate={spy}>
        <button />
      </Tippy>,
    )
    expect(spy).toHaveBeenCalledTimes(1)
    const arg = spy.mock.calls[0][0]
    expect(arg.reference).toBeDefined()
    expect(arg.popper).toBeDefined()
  })

  test('renders react element content inside the content prop', () => {
    const { container } = render(
      <Tippy content={<strong>tooltip</strong>}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.popper.querySelector('strong')).not.toBeNull()
  })

  test('custom class name get added to DOM', () => {
    const className = 'hello'
    const { container } = render(
      <Tippy content="tip content" className={className}>
        <button />
      </Tippy>,
    )
    const tip = container.querySelector('button')._tippy
    expect(tip.popper.querySelector(`.${className}`)).not.toBeNull()
  })

  test('custom class name get added to DOM', () => {
    const classNames = 'hello world'
    const { container } = render(
      <Tippy content="tip content" className={classNames}>
        <button />
      </Tippy>,
    )
    const tip = container.querySelector('button')._tippy
    expect(tip.popper.querySelector('.hello')).not.toBeNull()
    expect(tip.popper.querySelector('.world')).not.toBeNull()
  })

  test('unmount destroys the tippy instance and allows garbage collection', () => {
    const { container, unmount } = render(
      <Tippy content="tooltip">
        <button />
      </Tippy>,
    )
    const button = container.querySelector('button')
    unmount()
    expect(button._tippy).toBeUndefined()
  })

  test('updating props updates the tippy instance', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" arrow={false}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.props.arrow).toBe(false)
    rerender(
      <Tippy content="tooltip" arrow={true}>
        <button />
      </Tippy>,
    )
    expect(instance.props.arrow).toBe(true)
  })

  test('component as a child', () => {
    const Child = React.forwardRef(function Comp(_, ref) {
      return <button ref={ref} />
    })
    const { container } = render(
      <Tippy content="tooltip">
        <Child />
      </Tippy>,
    )
    expect(container.querySelector('button')._tippy).toBeDefined()
  })

  test('tooltip content is not rendered to the DOM', () => {
    expect(
      ReactDOMServer.renderToString(
        <Tippy content={<div>Tooltip</div>}>
          <button />
        </Tippy>,
      ).includes('<div>Tooltip</div>'),
    ).toBe(false)
  })

  test('refs are preserved on the child', done => {
    class App extends React.Component {
      refObject = React.createRef()
      componentDidMount() {
        expect(this.callbackRef instanceof Element).toBe(true)
        expect(this.refObject.current instanceof Element).toBe(true)
        done()
      }
      render() {
        return (
          <>
            <Tippy content="tooltip">
              <button ref={node => (this.callbackRef = node)} />
            </Tippy>
            <Tippy content="tooltip">
              <button ref={this.refObject} />
            </Tippy>
          </>
        )
      }
    }
    render(<App />)
  })

  test('nesting', () => {
    render(
      <Tippy content="tooltip" placement="bottom" multiple>
        <Tippy content="tooltip" placement="left" multiple>
          <Tippy content="tooltip">
            <button>Text</button>
          </Tippy>
        </Tippy>
      </Tippy>,
    )
  })

  test('props.isEnabled initially `true`', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" isEnabled={true}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.state.isEnabled).toBe(true)
    rerender(
      <Tippy content="tooltip" isEnabled={false}>
        <button />
      </Tippy>,
    )
    expect(instance.state.isEnabled).toBe(false)
  })

  test('props.isEnabled initially `false`', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" isEnabled={false}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.state.isEnabled).toBe(false)
    rerender(
      <Tippy content="tooltip" isEnabled={true}>
        <button />
      </Tippy>,
    )
    expect(instance.state.isEnabled).toBe(true)
  })

  test('props.isVisible initially `true`', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" isVisible={true}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.state.isVisible).toBe(true)
    rerender(
      <Tippy content="tooltip" isVisible={false}>
        <button />
      </Tippy>,
    )
    expect(instance.state.isVisible).toBe(false)
  })

  test('props.isVisible initially `false`', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" isVisible={false}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.state.isVisible).toBe(false)
    rerender(
      <Tippy content="tooltip" isVisible={true}>
        <button />
      </Tippy>,
    )
    expect(instance.state.isVisible).toBe(true)
  })
})
