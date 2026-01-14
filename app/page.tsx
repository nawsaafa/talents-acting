'use client';

import { useState } from 'react';
import { Container } from '@/components/layout';
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  Loading,
} from '@/components/ui';
import { Star, Send, Search } from 'lucide-react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const categoryOptions = [
    { value: 'actor', label: 'Actor' },
    { value: 'comedian', label: 'Comedian' },
    { value: 'performer', label: 'Performer' },
    { value: 'model', label: 'Model' },
  ];

  return (
    <Container as="section" className="py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="mb-4">Discover Amazing Talent</h1>
        <p className="text-lg text-[var(--color-neutral-600)] max-w-2xl mx-auto">
          Connect with actors, comedians, and performers. Find the perfect
          talent for your next production.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Button size="lg" leftIcon={<Search size={20} />}>
            Browse Talents
          </Button>
          <Button variant="outline" size="lg">
            Join as Talent
          </Button>
        </div>
      </div>

      {/* Component Demo Section */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Button Variants Card */}
        <Card hover>
          <CardHeader>
            <h3 className="text-lg font-semibold">Button Variants</h3>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm">
                Primary
              </Button>
              <Button variant="secondary" size="sm">
                Secondary
              </Button>
              <Button variant="outline" size="sm">
                Outline
              </Button>
              <Button variant="ghost" size="sm">
                Ghost
              </Button>
              <Button variant="danger" size="sm">
                Danger
              </Button>
            </div>
          </CardBody>
          <CardFooter>
            <Button isLoading size="sm">
              Loading State
            </Button>
          </CardFooter>
        </Card>

        {/* Form Inputs Card */}
        <Card hover>
          <CardHeader>
            <h3 className="text-lg font-semibold">Form Components</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Input
                label="Search Talents"
                placeholder="Enter name or skill..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helperText="Search by name, skill, or location"
              />
              <Select
                label="Category"
                options={categoryOptions}
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                placeholder="Select category"
              />
            </div>
          </CardBody>
          <CardFooter>
            <Input label="With Error" error="This field is required" required />
          </CardFooter>
        </Card>

        {/* Loading & Modal Card */}
        <Card hover>
          <CardHeader>
            <h3 className="text-lg font-semibold">Loading & Modal</h3>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4 mb-4">
              <Loading size="sm" color="primary" />
              <Loading size="md" color="secondary" />
              <Loading size="lg" color="primary" />
            </div>
            <p className="text-sm text-[var(--color-neutral-500)] mb-4">
              Loading spinners in different sizes
            </p>
          </CardBody>
          <CardFooter>
            <Button
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Star size={16} />}
            >
              Open Modal
            </Button>
          </CardFooter>
        </Card>

        {/* Icon Buttons Card */}
        <Card hover>
          <CardHeader>
            <h3 className="text-lg font-semibold">Buttons with Icons</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <Button leftIcon={<Star size={16} />} className="w-full">
                Featured Talents
              </Button>
              <Button
                variant="secondary"
                rightIcon={<Send size={16} />}
                className="w-full"
              >
                Send Message
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Disabled State
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Card Variations */}
        <Card padding="lg" shadow="lg" className="md:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold">Card Variations</h3>
          </CardHeader>
          <CardBody>
            <p className="text-[var(--color-neutral-600)]">
              Cards can have different padding sizes (none, sm, md, lg) and
              shadow depths (none, sm, md, lg). They can also have a hover
              effect for interactive elements.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <Card padding="sm" shadow="none" className="text-center">
                <p className="text-sm">No Shadow</p>
              </Card>
              <Card padding="sm" shadow="sm" className="text-center">
                <p className="text-sm">Small Shadow</p>
              </Card>
              <Card padding="sm" shadow="md" className="text-center">
                <p className="text-sm">Medium Shadow</p>
              </Card>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Welcome to Talents Acting"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-[var(--color-neutral-600)]">
            This modal demonstrates focus trap and keyboard support. Press Tab
            to cycle through focusable elements, and Escape to close.
          </p>
          <Input label="Your Name" placeholder="Enter your name" />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Continue</Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
