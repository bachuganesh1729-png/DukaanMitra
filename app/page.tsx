'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import {
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  Grid2X2,
  Headphones,
  History as HistoryIcon,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Menu,
  Mic,
  Package,
  Play,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  Volume2,
  X,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'


type PageKey =
  | 'dashboard'
  | 'new-order'
  | 'history'
  | 'inventory'
  | 'customers'
  | 'settings'

type OrderItem = {
  id: number
  name: string
  quantity: number
  unit: string
  price: number
}

const navItems: {
  key: PageKey
  label: string
  icon: typeof LayoutDashboard
}[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'new-order', label: 'New Order', icon: ShoppingBag },
  { key: 'history', label: 'Order History', icon: HistoryIcon },
  { key: 'inventory', label: 'Inventory', icon: Package },
  { key: 'customers', label: 'Customers', icon: Users },
]
const inventoryItems = [
  {
    name: 'Aashirvaad Atta',
    category: 'Staples',
    stock: 24,
    unit: 'kg',
    price: '₹58',
    status: 'In stock',
  },
  {
    name: 'Tata Salt',
    category: 'Staples',
    stock: 8,
    unit: 'packs',
    price: '₹28',
    status: 'Low stock',
  },
  {
    name: 'Thums Up',
    category: 'Beverages',
    stock: 36,
    unit: 'bottles',
    price: '₹40',
    status: 'In stock',
  },
  {
    name: 'Toor Dal',
    category: 'Pulses',
    stock: 5,
    unit: 'kg',
    price: '₹165',
    status: 'Low stock',
  },
  {
    name: 'Surf Excel',
    category: 'Home care',
    stock: 18,
    unit: 'packs',
    price: '₹110',
    status: 'In stock',
  },
]

const formatINR = (value: number) =>
  `₹${value.toLocaleString('en-IN')}`

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="brand-mark">
        <span className="brand-mark-dot" />
        <span className="brand-mark-line" />
      </div>

      <div>
        <div className="text-[17px] font-bold tracking-[-0.03em] text-[#143d2b]">
          Dukaan<span className="text-[#e8793d]">Mitra</span>
        </div>

        <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8a9b91]">
          Smart retail, simply done
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'status-badge',
        status === 'Completed' || status === 'In stock'
          ? 'status-success'
          : status === 'Processing'
            ? 'status-processing'
            : 'status-warning'
      )}
    >
      <span className="status-dot" />
      {status}
    </span>
  )
}

function Sidebar({
  page,
  setPage,
}: {
  page: PageKey
  setPage: (page: PageKey) => void
}) {
  return (
    <aside className="sidebar">
      <div className="px-7 pt-7">
        <Logo />
      </div>

      <div className="px-4 pt-12">
        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#91a69b]">
          Workspace
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={cn(
                'nav-item',
                page === key && 'nav-item-active'
              )}
            >
              <Icon
                className="size-[18px]"
                strokeWidth={1.8}
              />

              <span>{label}</span>

              {key === 'new-order' && (
                <span className="ml-auto rounded-full bg-[#f4e9df] px-2 py-0.5 text-[10px] font-bold text-[#d86b38]">
                  NEW
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mx-7 my-8 h-px bg-[#e9eee9]" />

      <div className="px-4">
        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#91a69b]">
          Manage
        </div>

        <button
          onClick={() => setPage('settings')}
          className={cn(
            'nav-item',
            page === 'settings' && 'nav-item-active'
          )}
        >
          <Settings
            className="size-[18px]"
            strokeWidth={1.8}
          />
          <span>Settings</span>
        </button>
      </div>

      <div className="mt-auto px-4 pb-5">
        <div className="rounded-2xl bg-[#f4f7f3] p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-full bg-[#e6f0e7] text-[#28714a]">
              <Headphones className="size-3.5" />
            </div>

            <span className="text-xs font-bold text-[#274a38]">
              Need a hand?
            </span>
          </div>

          <p className="mb-3 text-[11px] leading-relaxed text-[#718378]">
            Our support team is here to help you grow.
          </p>

          <button className="text-[11px] font-bold text-[#28714a]">
            Visit Help Centre
            <ChevronRight className="ml-1 inline size-3" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-[#e9eee9] pt-5">
          <div className="avatar avatar-green">SN</div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-bold text-[#254435]">
              Srinivas Naidu
            </div>

            <div className="truncate text-[10px] text-[#8a9b91]">
              Sri Lakshmi Kirana
            </div>
          </div>

          <button
            className="text-[#92a098]"
            aria-label="Log out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

function Topbar({ title }: { title: string }) {
  return (
    <header className="topbar">
      <div className="flex items-center gap-3">
        <button
          className="mobile-menu"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>

        <div>
          <div className="text-[11px] font-medium text-[#93a198]">
            Workspace /{' '}
            <span className="text-[#4b6b59]">{title}</span>
          </div>

          <h1 className="mt-1 text-[20px] font-bold tracking-[-0.03em] text-[#173d2b]">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="icon-button relative"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" />
          <span className="notification-dot" />
        </button>

        <div className="hidden h-7 w-px bg-[#e8eee9] sm:block" />

        <button className="flex items-center gap-2">
          <div className="avatar avatar-orange">SN</div>

          <span className="hidden text-xs font-bold text-[#385443] sm:block">
            Srinivas
          </span>

          <ChevronDown className="size-3.5 text-[#8b9c91]" />
        </button>
      </div>
    </header>
  )
}

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  accent,
  note,
}: {
  label: string
  value: string
  change: string
  icon: typeof IndianRupee
  accent: string
  note: string
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-[#819188]">
            {label}
          </p>

          <p className="mt-2 text-[25px] font-bold tracking-[-0.04em] text-[#183f2d]">
            {value}
          </p>
        </div>

        <div className={cn('stat-icon', accent)}>
          <Icon
            className="size-[17px]"
            strokeWidth={2}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[10px]">
        <span className="trend-up">
          <TrendingUp className="size-3" />
          {change}
        </span>

        <span className="text-[#96a39b]">{note}</span>
      </div>
    </div>
  )
}

function SalesChart() {
  const heights = [
    36, 48, 42, 61, 52, 68, 57, 72, 50, 65,
    78, 62, 84, 74, 89, 70, 92, 81, 96, 87,
    100, 82, 93, 105, 88, 99, 112, 101, 118, 108,
  ]

  return (
    <div className="chart-wrap">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="section-title">Sales overview</h3>

          <p className="mt-1 text-[11px] text-[#8b9b91]">
            Your sales performance for the last 30 days
          </p>
        </div>

        <button className="period-select">
          Last 30 days
          <ChevronDown className="size-3" />
        </button>
      </div>

      <div className="flex h-[190px] items-end gap-[5px] border-b border-l border-[#edf0eb] px-3 pb-0 pt-5 sm:gap-2">
        {heights.map((height, i) => (
          <div
            key={i}
            className={cn(
              'chart-bar',
              i === 26 && 'chart-bar-active'
            )}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="mt-3 flex justify-between pl-3 text-[10px] font-medium text-[#a0aaa3]">
        <span>01 May</span>
        <span>07 May</span>
        <span>14 May</span>
        <span>21 May</span>
        <span>30 May</span>
      </div>
    </div>
  )
}
function RecentOrders({
  setPage,
}: {
  setPage: (page: PageKey) => void
}) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true)
        setError('')

        const result = await api.listOrders()
        setOrders(result.slice(0, 5))
      } catch (err) {
        console.error('Failed to fetch recent orders:', err)
        setError('Unable to load recent orders.')
      } finally {
        setLoading(false)
      }
    }

    fetchRecentOrders()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString.replace(' ', 'T')}Z`)

    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <h3 className="section-title">Recent orders</h3>

          <p className="mt-1 text-[11px] text-[#8b9b91]">
            Keep track of your latest customer orders
          </p>
        </div>

        <button
          onClick={() => setPage('history')}
          className="text-[11px] font-bold text-[#32754e]"
        >
          View all
          <ChevronRight className="ml-1 inline size-3" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-[#8b9b91]">
                  Loading recent orders...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-[#8b9b91]">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.order_id}>
                  <td className="font-bold text-[#37634b]">
                    #{order.order_id}
                  </td>

                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="avatar avatar-sm avatar-sage">
                        WC
                      </div>

                      <span className="font-semibold text-[#375443]">
                        Walk-in Customer
                      </span>
                    </div>
                  </td>

                  <td className="text-[#839289]">
                    {order.items?.length || 0} items
                  </td>

                  <td className="font-bold text-[#2b4c39]">
                    ₹{Number(order.total || 0).toFixed(2)}
                  </td>

                  <td>
                    <StatusBadge
                      status={
                        order.status === 'confirmed'
                          ? 'Completed'
                          : order.status
                      }
                    />
                  </td>

                  <td className="text-[#9aa69e]">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
function Dashboard({
  setPage,
}: {
  setPage: (page: PageKey) => void
}) {
  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Thursday, 30 May 2024
          </div>

          <h2 className="page-heading">
            Good morning, Srinivas <span className="wave">✦</span>
          </h2>

          <p className="page-subtitle">
            Here&apos;s what&apos;s happening at Sri Lakshmi Kirana today.
          </p>
        </div>

        <Button
          onClick={() => setPage('new-order')}
          className="primary-button"
        >
          <Plus data-icon="inline-start" />
          Create New Order
        </Button>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Today&apos;s sales"
          value="₹24,680"
          change="12.5%"
          note="vs. yesterday"
          icon={IndianRupee}
          accent="stat-icon-green"
        />

        <StatCard
          label="Total orders"
          value="48"
          change="8.2%"
          note="vs. yesterday"
          icon={FileText}
          accent="stat-icon-blue"
        />

        <StatCard
          label="Pending orders"
          value="07"
          change="3.1%"
          note="vs. yesterday"
          icon={Clock3}
          accent="stat-icon-orange"
        />

        <StatCard
          label="Total products"
          value="236"
          change="4.6%"
          note="this month"
          icon={Package}
          accent="stat-icon-purple"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <SalesChart />

        <div className="panel p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h3 className="section-title">Order activity</h3>

              <p className="mt-1 text-[11px] text-[#8b9b91]">
                Orders received this week
              </p>
            </div>

            <div className="rounded-xl bg-[#eef6ef] p-2 text-[#32754e]">
              <BarChart3 className="size-4" />
            </div>
          </div>

          <div className="flex h-[178px] items-end justify-between gap-2 px-1">
            {[42, 68, 54, 85, 61, 76, 93].map((height, i) => (
              <div
                key={i}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className={cn(
                    'w-full rounded-t-md',
                    i === 6 ? 'bg-[#28754e]' : 'bg-[#dceee1]'
                  )}
                  style={{ height: `${height}%` }}
                />

                <span className="text-[10px] font-medium text-[#99a69e]">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-[#edf0eb] pt-4 text-[11px] text-[#819188]">
            <span className="size-2 rounded-full bg-[#28754e]" />
            <span>48 orders</span>
            <span className="ml-auto font-bold text-[#28754e]">
              +18.4%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <RecentOrders setPage={setPage} />
      </div>
    </>
  )
}

/* =========================================================
   NEW ORDER PAGE
   Real microphone recording + Gnani STT integration
========================================================= */

function NewOrder() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [confirmationText, setConfirmationText] = useState('')
  const [audioUrl, setAudioUrl] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [items, setItems] = useState<OrderItem[]>([])

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items]
  )

  const updateItem = (
    id: number,
    field: 'name' | 'quantity' | 'unit',
    value: string
  ) => {
    setItems(current => current.map(item => item.id === id
      ? { ...item, [field]: field === 'quantity' ? Math.max(0.01, Number(value) || 0.01) : value }
      : item))
    setConfirmed(false)
  }

  const addItem = () => {
    setItems(current => [...current, {
      id: Date.now(), name: 'New product', quantity: 1, unit: 'unit', price: 0,
    }])
    setConfirmed(false)
  }

  const startRecording = async () => {
    try {
      setError('')
      setTranscript('')
      setConfirmed(false)
      setOrderId('')
      setAudioUrl('')

      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        throw new Error('Microphone recording is not supported in this browser.')
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = event => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }

      recorder.onerror = () => {
        setError('An error occurred while recording audio.')
        setListening(false)
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.onstop = async () => {
        setIsProcessing(true)
        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: recorder.mimeType || 'audio/webm',
          })
          if (!audioBlob.size) throw new Error('No audio was recorded. Please try again.')

          const result = await api.transcribe(audioBlob)
          if (!result.text?.trim()) throw new Error('No speech was detected. Please try again.')
          setTranscript(result.text)

          const parsedOrder = await api.parseOrder(result.text)
          if (!parsedOrder.items?.length) {
            setItems([])
            throw new Error('We heard your order, but could not identify supported grocery products. Please edit the order manually or try again.')
          }

          const productPrices: Record<string, number> = {
            Rice: 55,
            'Sunflower Oil': 150,
            Sugar: 45,
            Milk: 60,
            'Wheat Flour': 50,
          }

          setItems(parsedOrder.items.map((item: { product: string; quantity: number; unit: string }, index: number) => ({
            id: Date.now() + index,
            name: item.product,
            quantity: Number(item.quantity),
            unit: item.unit,
            price: productPrices[item.product] ?? 0,
          })))
          setConfirmed(false)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Transcription failed. Please try again.')
        } finally {
          setIsProcessing(false)
          stream.getTracks().forEach(track => track.stop())
        }
      }

      recorder.start()
      setListening(true)
    } catch (err) {
      setListening(false)
      setError(err instanceof Error ? err.message : 'Microphone access failed. Please allow microphone permission.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
      setListening(false)
    }
  }

  const clearTranscript = () => {
    setTranscript('')
    setError('')
  }

  const handleConfirmOrder = async () => {
    if (!items.length) {
      setError('Add or record at least one item before confirming the order.')
      return
    }

    setError('')
    setIsConfirming(true)
    try {
      const result = await api.confirmOrder({
        items: items.map(item => ({
          product: item.name,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
          item_total: item.quantity * item.price,
        })),
        total,
      })

      setOrderId(result.id)
      setConfirmationText(result.confirmationText)
      setAudioUrl(result.audioUrl)
      setConfirmed(true)

      if (audioRef.current) {
        audioRef.current.src = result.audioUrl
        try {
          await audioRef.current.play()
        } catch {
          // Browser autoplay may be blocked; the replay button remains available.
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order confirmation failed. Please try again.')
    } finally {
      setIsConfirming(false)
    }
  }

  const playConfirmation = async () => {
    if (!audioUrl || !audioRef.current) return
    audioRef.current.src = audioUrl
    try {
      await audioRef.current.play()
    } catch {
      setError('Could not play the confirmation audio. Please try again.')
    }
  }

  return (
    <div className="new-order-layout">
      <div className="order-main">
        <div className="welcome-row mb-6">
          <div>
            <div className="eyebrow"><Sparkles className="size-3.5" /> Voice-powered ordering</div>
            <h2 className="page-heading">Create a new order</h2>
            <p className="page-subtitle">Take an order naturally — we&apos;ll take care of the rest.</p>
          </div>
          <div className="language-pill"><span className="language-dot" /> Telugu + English</div>
        </div>

        <div className={cn('voice-card', listening && 'voice-card-listening')}>
          <div className="voice-card-glow" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="recording-label">{isProcessing ? 'Processing audio...' : listening ? 'Listening now' : 'Ready when you are'}</div>
            <button
              className={cn('mic-button', listening && 'mic-button-active')}
              onClick={listening ? stopRecording : startRecording}
              disabled={isProcessing || isConfirming}
              aria-label={listening ? 'Stop listening' : 'Start voice order'}
            >
              {listening && <><span className="mic-ring mic-ring-one" /><span className="mic-ring mic-ring-two" /></>}
              <Mic className="size-8" strokeWidth={1.8} />
            </button>
            <h3 className="mt-5 text-[19px] font-bold tracking-[-0.03em] text-white">
              {isProcessing ? 'Processing your order...' : listening ? "I'm listening..." : 'Start a voice order'}
            </h3>
            <p className="mt-2 max-w-[310px] text-center text-xs leading-relaxed text-[#b9d1c2]">
              {isProcessing ? 'Please wait while Gnani converts your speech into text.' : listening ? "Speak naturally in Telugu or English. I'll capture the items for you." : "Tap the microphone and speak your customer's grocery list in Telugu or English."}
            </p>
            {listening && <div className="waveform mt-5">{Array.from({ length: 30 }).map((_, i) => <span key={i} style={{ height: `${12 + ((i * 17) % 28)}px` }} />)}</div>}
            <div className="mt-5 flex items-center gap-2 text-[10px] font-semibold text-[#9fbca9]">
              <span className="flex items-center gap-1.5 rounded-full border border-[#5a8069] bg-[#315d45] px-3 py-1.5"><Volume2 className="size-3" /> Voice input enabled</span>
              <span className="flex items-center gap-1.5 rounded-full border border-[#5a8069] bg-[#315d45] px-3 py-1.5"><span className="text-[9px]">తెలుగు</span> + EN</span>
            </div>
          </div>
        </div>

        <div className="transcript-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2"><h3 className="section-title">Transcribed order</h3><span className="live-tag">LIVE PREVIEW</span></div>
              <p className="mt-1 text-[11px] text-[#8b9b91]">Review what we heard before adding items</p>
            </div>
            <button className="icon-button" aria-label="Clear transcription" onClick={clearTranscript}><X className="size-4" /></button>
          </div>
          <div className="transcript-bubble">
            <div className="transcript-avatar"><Mic className="size-3.5" /></div>
            <div className="min-w-0 flex-1"><p className="text-[13px] leading-relaxed text-[#456052]">{transcript || 'Your transcription will appear here after recording.'}</p></div>
          </div>
          {isProcessing && <div className="mt-3 text-[11px] font-medium text-[#32754e]">Transcribing your speech and identifying grocery items...</div>}
          {error && <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-600">{error}</div>}
          {transcript && !isProcessing && !error && <div className="mt-3 flex items-center gap-2 text-[10px] text-[#8c9c92]"><Check className="size-3.5 text-[#3b8b5d]" /> Transcription completed successfully.</div>}
        </div>

        <div className="panel mt-5 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0eb] px-6 py-5">
            <div><div className="flex items-center gap-2"><h3 className="section-title">Order items</h3><span className="count-badge">{items.length}</span></div><p className="mt-1 text-[11px] text-[#8b9b91]">Review detected items, quantities and demo prices</p></div>
            <Button variant="outline" onClick={addItem} className="secondary-button"><Plus data-icon="inline-start" />Add item</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table order-table">
              <thead><tr><th>Product name</th><th>Quantity</th><th>Unit</th><th>Price</th><th><span className="sr-only">Remove</span></th></tr></thead>
              <tbody>
                {items.map(item => <tr key={item.id}>
                  <td><input className="table-input product-input" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} /></td>
                  <td><input className="table-input quantity-input" type="number" min="0.01" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', e.target.value)} /></td>
                  <td><input className="table-input unit-input" value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)} /></td>
                  <td className="font-bold text-[#365743]">{formatINR(item.quantity * item.price)}</td>
                  <td><button className="remove-button" onClick={() => { setItems(current => current.filter(row => row.id !== item.id)); setConfirmed(false) }} aria-label={`Remove ${item.name}`}><Trash2 className="size-4" /></button></td>
                </tr>)}
                {!items.length && <tr><td colSpan={5} className="py-8 text-center text-sm text-[#91a098]">No items yet. Record a voice order or add an item manually.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-4 border-t border-[#edf0eb] bg-[#fbfcfa] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#91a098]">Estimated total</div><div className="mt-1 text-[24px] font-bold tracking-[-0.04em] text-[#173e2b]">{formatINR(total)}</div></div>
            <Button onClick={handleConfirmOrder} disabled={!items.length || listening || isProcessing || isConfirming} className="confirm-button">
              {isConfirming ? 'Confirming...' : <><Check data-icon="inline-start" />Confirm Order<ChevronRight data-icon="inline-end" /></>}
            </Button>
          </div>
        </div>

        {confirmed && <div className="success-banner">
          <div className="success-icon"><Check className="size-4" /></div>
          <div className="flex-1"><div className="font-bold text-[#245b3a]">Order confirmed successfully!</div><div className="mt-1 text-[11px] text-[#668270]">Order {orderId} is confirmed. {confirmationText}</div></div>
          <button onClick={() => setConfirmed(false)} className="text-[#77a183]" aria-label="Dismiss confirmation"><X className="size-4" /></button>
        </div>}
      </div>

      <aside className="order-aside">
        <div className="panel p-5">
          <div className="flex items-center justify-between"><h3 className="section-title">Order summary</h3><span className="draft-badge">{confirmed ? 'CONFIRMED' : 'DRAFT'}</span></div>
          <div className="summary-illustration"><div className="summary-orbit orbit-one" /><div className="summary-orbit orbit-two" /><div className="summary-bag"><ShoppingBag className="size-7" /></div><span className="summary-sparkle sparkle-one">✦</span><span className="summary-sparkle sparkle-two">✦</span></div>
          <div className="summary-row"><span>Items</span><strong>{items.length} products</strong></div>
          <div className="summary-row"><span>Subtotal</span><strong>{formatINR(total)}</strong></div>
          <div className="summary-row"><span>Delivery</span><strong className="text-[#3d8758]">Free</strong></div>
          <div className="summary-total"><span>Total</span><strong>{formatINR(total)}</strong></div>
        </div>

        <div className="panel mt-5 p-5">
          <div className="flex items-start gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#fdf0e7] text-[#db7441]"><Upload className="size-4" /></div><div><h3 className="text-xs font-bold text-[#345443]">Have a recorded order?</h3><p className="mt-1 text-[10px] leading-relaxed text-[#8b9b91]">Upload an audio file and we&apos;ll transcribe it for you.</p><span className="mt-3 inline-block text-[11px] font-bold text-[#a5aaa6]">Audio upload coming soon</span></div></div>
        </div>

        {confirmed && <div className="voice-confirm-card mt-5">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#d8ecdf] text-[#2e7b4d]"><Volume2 className="size-4" /></div>
          <div className="flex-1"><div className="text-xs font-bold text-[#2f5f41]">Telugu confirmation</div><div className="mt-1 text-[10px] text-[#789183]">{orderId}</div></div>
          <button className="play-button" onClick={playConfirmation} aria-label="Play confirmation"><Play className="ml-0.5 size-3.5 fill-current" /></button>
        </div>}
        <audio ref={audioRef} src={audioUrl || undefined} preload="auto" />
      </aside>
    </div>
  )
}


function HistoryPage() {
  const [query, setQuery] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError('')

        const result = await api.listOrders()
        setOrders(result)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        setError('Unable to load order history. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    const search = query.toLowerCase()

    return (
      order.order_id?.toLowerCase().includes(search) ||
      order.items?.some((item: any) =>
        item.product?.toLowerCase().includes(search)
      )
    )
  })

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString.replace(' ', 'T')}Z`)

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div>
      <div className="welcome-row mb-6">
        <div>
          <h2 className="page-heading">
            Order history
          </h2>

          <p className="page-subtitle">
            A complete view of every order from your shop.
          </p>
        </div>

        <Button className="secondary-button">
          <FileText data-icon="inline-start" />
          Export report
        </Button>
      </div>

      <div className="panel overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-[#edf0eb] p-5">
          <div className="search-box">
            <Search className="size-4" />

            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search orders or products..."
            />
          </div>

          <button className="filter-button">
            All status
            <ChevronDown className="size-3.5" />
          </button>

          <button className="filter-button">
            Last 30 days
            <ChevronDown className="size-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#839289]">
                    Loading order history...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#839289]">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.order_id}>
                    <td className="font-bold text-[#37634b]">
                      #{order.order_id}
                    </td>

                    <td className="text-[#839289]">
                      {formatDate(order.created_at)}
                    </td>

                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="avatar avatar-sm avatar-teal">
                          WC
                        </div>

                        <span className="font-semibold text-[#375443]">
                          Walk-in Customer
                        </span>
                      </div>
                    </td>

                    <td className="text-[#839289]">
                      {order.items?.length ?? 0} items
                    </td>

                    <td className="font-bold text-[#2b4c39]">
                      {Number(order.total).toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                      })}
                    </td>

                    <td>
                      <StatusBadge
                        status={
                          order.status === 'confirmed'
                            ? 'Completed'
                            : order.status
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
function Inventory() {
  return (
    <div>
      <div className="welcome-row mb-6">
        <div>
          <h2 className="page-heading">
            Inventory
          </h2>

          <p className="page-subtitle">
            Keep your shelves stocked and your customers happy.
          </p>
        </div>

        <Button className="primary-button">
          <Plus data-icon="inline-start" />
          Add product
        </Button>
      </div>

      <div className="stats-grid inventory-stats">
        <StatCard
          label="Total products"
          value="236"
          change="4.6%"
          note="this month"
          icon={Package}
          accent="stat-icon-purple"
        />

        <StatCard
          label="Low stock items"
          value="12"
          change="2.1%"
          note="needs attention"
          icon={Bell}
          accent="stat-icon-orange"
        />

        <StatCard
          label="Inventory value"
          value="₹4.8L"
          change="8.4%"
          note="vs. last month"
          icon={IndianRupee}
          accent="stat-icon-green"
        />
      </div>

      <div className="panel mt-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0eb] p-5">
          <div>
            <h3 className="section-title">
              Product inventory
            </h3>

            <p className="mt-1 text-[11px] text-[#8b9b91]">
              Manage your current stock levels and prices
            </p>
          </div>

          <div className="search-box search-small">
            <Search className="size-4" />
            <input placeholder="Search products..." />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product name</th>
                <th>Category</th>
                <th>Stock quantity</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {inventoryItems.map(item => (
                <tr key={item.name}>
                  <td className="font-semibold text-[#375443]">
                    {item.name}
                  </td>

                  <td className="text-[#839289]">
                    {item.category}
                  </td>

                  <td className="font-semibold text-[#385744]">
                    {item.stock} {item.unit}
                  </td>

                  <td className="font-bold text-[#2b4c39]">
                    {item.price}
                  </td>

                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


function PlaceholderPage({
  title,
  icon: Icon,
  description,
}: {
  title: string
  icon: typeof Users
  description: string
}) {
  return (
    <div className="empty-page">
      <div className="empty-icon">
        <Icon className="size-7" />
      </div>

      <h2 className="page-heading">{title}</h2>

      <p className="page-subtitle">
        {description}
      </p>

      <Button className="primary-button mt-6">
        <Sparkles data-icon="inline-start" />
        Coming soon
      </Button>
    </div>
  )
}

export default function Page() {
  const [page, setPage] = useState<PageKey>('dashboard')

  const title =
    navItems.find(item => item.key === page)?.label ?? 'Settings'

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
      />

      <main className="main-content">
        <Topbar title={title} />

        <div className="content-area">
          {page === 'dashboard' && (
            <Dashboard setPage={setPage} />
          )}

          {page === 'new-order' && <NewOrder />}

          {page === 'history' && <HistoryPage />}

          {page === 'inventory' && <Inventory />}

          {page === 'customers' && (
            <PlaceholderPage
              title="Customers"
              description="Build stronger relationships with the people who shop with you."
              icon={Users}
            />
          )}

          {page === 'settings' && (
            <PlaceholderPage
              title="Settings"
              description="Personalise your workspace and voice ordering preferences."
              icon={Settings}
            />
          )}
        </div>
      </main>
    </div>
  )
}