import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Button, message, Flex, ConfigProvider, theme } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, CompassOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';
import styles from './styles.less';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const decoRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 增强的粒子动画效果 - 更生动的运动
  useEffect(() => {
    const particles = particlesRef.current;
    if (!particles) return;

    const particleCount = 25; // 稍增粒子数量，更丰富的效果
    const particleArray: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      originalSize: number;
    }> = [];

    // 初始化粒子 - 增强的动画属性
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2 + 0.8; // 稍大的粒子
      particleArray.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: size,
        originalSize: size,
        speedX: (Math.random() - 0.5) * 1.2, // 稍快的速度
        speedY: (Math.random() - 0.5) * 1.2,
        opacity: Math.random() * 0.4 + 0.1, // 稍高的透明度
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2, // 旋转速度
      });
    }

    const animateParticles = () => {
      particles.innerHTML = '';
      
      particleArray.forEach((particle, index) => {
        // 更新位置
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;
        
        // 添加轻微的脉动效果
        particle.size = particle.originalSize + Math.sin(Date.now() * 0.001 + index) * 0.3;

        // 边界检测 - 更平滑的重置
        if (particle.x > window.innerWidth + 50) particle.x = -50;
        if (particle.x < -50) particle.x = window.innerWidth + 50;
        if (particle.y > window.innerHeight + 50) particle.y = -50;
        if (particle.y < -50) particle.y = window.innerHeight + 50;

        const particleElement = document.createElement('div');
        particleElement.className = styles.particle;
        particleElement.style.left = `${particle.x}px`;
        particleElement.style.top = `${particle.y}px`;
        particleElement.style.width = `${particle.size}px`;
        particleElement.style.height = `${particle.size}px`;
        particleElement.style.opacity = `${particle.opacity}`;
        particleElement.style.transform = `rotate(${particle.rotation}deg)`;
        particleElement.style.animationDelay = `${index * 0.1}s`;
        
        particles.appendChild(particleElement);
      });

      requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      particles.innerHTML = '';
    };
  }, []);

  // 增强的3D效果和动画（仅作用于背景层，避免影响文本渲染清晰度）
  useEffect(() => {
    const bg = bgRef.current;
    const deco = decoRef.current;
    if (!bg && !deco) return;

    const setTransform = (t: string) => {
      if (bg) bg.style.transform = t;
      if (deco) deco.style.transform = t;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const x = (clientX / innerWidth - 0.5) * 15;
      const y = (clientY / innerHeight - 0.5) * 15;

      setTransform(`perspective(1200px) rotateY(${x}deg) rotateX(${-y}deg)`);
    };

    const handleMouseLeave = () => {
      setTransform('none');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (values: LoginFormData) => {
    console.log("values", values);
    setLoading(true);
    try {
      // 模拟登录请求
      // await new Promise(resolve => setTimeout(resolve, 1200)); // 稍快的响应
      message.success('登录成功！正在跳转...');
      // 跳转到首页
      navigate('/');
    } catch (error) {
      message.error('登录失败，请检查电子邮件和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: token.colorPrimary,
          borderRadius: token.borderRadius,
          fontSize: token.fontSize,
          colorBgContainer: token.colorBgContainer,
          colorBorder: token.colorBorder,
        },
        components: {
          Input: {
            colorBgContainer: token.colorBgContainer,
            colorBorder: token.colorBorder,
            colorText: token.colorText,
            colorTextPlaceholder: token.colorTextPlaceholder,
            borderRadius: token.borderRadius,
            controlHeight: token.controlHeight,
            activeBorderColor: token.colorPrimary,
            hoverBorderColor: token.colorPrimary,
            activeShadow: token.boxShadowSecondary,
            hoverBg: token.colorBgContainer,
          },
          Button: {
            borderRadius: token.borderRadius,
            controlHeight: token.controlHeight,
            primaryShadow: token.boxShadowSecondary,
          },
          Form: {
            itemMarginBottom: token.marginLG,
          },
        },
      }}
    >
      <div
        className={styles.loginContainer}
        style={{
          ['--color-primary' as any]: token.colorPrimary,
          ['--color-bg-light' as any]: token.colorBgLayout ?? token.colorBgBase,
          ['--color-text-primary' as any]: token.colorText,
          ['--color-text-secondary' as any]: token.colorTextSecondary,
          ['--color-text-tertiary' as any]: token.colorTextTertiary,
        }}
      >
        {/* 更清新的渐变背景 */}
        <div ref={bgRef} className={styles.gradientBackground}>
          <div className={styles.gradient1}></div>
          <div className={styles.gradient2}></div>
          <div className={styles.gradient3}></div>
          <div className={styles.gradient4}></div> {/* 新增一层更淡的渐变 */}
        </div>
        
        {/* 更简洁的粒子效果层 */}
        <div ref={particlesRef} className={styles.particles}></div>
        
        {/* 登录表单容器 - 更明亮的效果 */}
        <Flex 
          justify="center" 
          align="center" 
          className={styles.loginWrapper}
          ref={containerRef}
        >
          <div className={styles.loginBox}>
            {/* 头部区域 - 艺术化品牌展示 */}
            <div className={styles.header}>
              <div className={styles.brandArt}>
                <div className={styles.logoContainer}>
                  <div className={styles.logoRing}></div>
                  <div className={styles.logoCore}>
                    <CompassOutlined className={styles.logoIcon} />
                  </div>
                </div>
                <div className={styles.brandText}>
                  <h1 className={styles.title}>知识罗盘</h1>
                  <p className={styles.subtitle}>Knowledge Compass</p>
                </div>
              </div>
              <div className={styles.loginHint}>
                <span className={styles.hintLine}></span>
                <span className={styles.hintText}>邮箱登录</span>
                <span className={styles.hintLine}></span>
              </div>
            </div>

            {/* 登录表单 - 更清新的样式 */}
            <Form
              form={form}
              onFinish={handleSubmit}
              className={styles.loginForm}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入电子邮件' },
                  { type: 'email', message: '请输入有效的电子邮件格式' },
                ]}
              >
                <Input
                  prefix={<MailOutlined className={styles.inputIcon} />}
                  placeholder="请输入电子邮件"
                  variant="borderless"
                  type="email"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="请输入密码"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  variant="borderless"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>

            {/* 底部链接 - 更简洁的设计 */}
            <Flex justify="center" align="center" gap="middle" className={styles.footer}>
              <a href="#" className={styles.link}>忘记密码？</a>
              <span className={styles.divider}>·</span>
              <a href="#" className={styles.link}>注册新账户</a>
            </Flex>
          </div>
        </Flex>

        {/* 装饰性元素 - 更简洁的设计 */}
        <div ref={decoRef} className={styles.decorativeElements}>
          <div className={styles.circle1}></div>
          <div className={styles.circle2}></div>
          <div className={styles.dot1}></div>
          <div className={styles.dot2}></div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LoginPage;