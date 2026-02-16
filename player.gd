extends CharacterBody2D

var speed = 100
var facing_right = true
var is_moving = false
var frame = 0
var frame_timer = 0.0

func _ready():
	draw_player()

func _physics_process(delta):
	var move_x = Input.get_axis("left", "right")
	var move_y = Input.get_axis("up", "down")
	
	is_moving = move_x != 0 or move_y != 0
	
	if is_moving:
		if move_x > 0:
			facing_right = true
		elif move_x < 0:
			facing_right = false
		
		velocity.x = move_x * speed
		velocity.y = move_y * speed
	else:
		velocity.x = move_toward(velocity.x, 0, speed)
		velocity.y = move_toward(velocity.y, 0, speed)
	
	move_and_slide()
	
	$SpriteBody.scale.x = 1 if facing_right else -1
	$SpriteArmor.scale.x = 1 if facing_right else -1
	$SpriteWeapon.scale.x = 1 if facing_right else -1
	
	frame_timer += delta
	if frame_timer > 0.15:
		frame_timer = 0
		frame = (frame + 1) % 4
		draw_player()

func draw_player():
	var data = GameData
	var wpn_color = data.get_weapon_color()
	var armor_color = data.get_armor_color()
	
	var img = Image.create(32, 40, false, Image.FORMAT_RGBA8)
	img.fill(Color(0,0,0,0))
	
	var leg_offs = 0 if frame % 2 == 0 and is_moving else 0
	
	for x in range(12, 20):
		img.set_pixel(x, 6, Color("FFD0B0"))
		img.set_pixel(x, 7, Color("FFD0B0"))
	
	img.set_pixel(14, 8, Color.BLACK)
	img.set_pixel(17, 8, Color.BLACK)
	img.set_pixel(15, 9, Color("FFE0C0"))
	img.set_pixel(16, 9, Color("FFE0C0"))
	
	for x in range(10, 22):
		for y in range(10, 22):
			img.set_pixel(x, y, armor_color.lightened(0.1))
	
	img.set_pixel(10, 10, armor_color.darkened(0.3))
	img.set_pixel(21, 10, armor_color.darkened(0.3))
	
	var leg_y = 22 + leg_offs
	img.set_pixel(12, leg_y, Color("4A3728"))
	img.set_pixel(13, leg_y, Color("4A3728"))
	img.set_pixel(18, leg_y, Color("4A3728"))
	img.set_pixel(19, leg_y, Color("4A3728"))
	
	if is_moving:
		var leg_y2 = 23 - leg_offs
		img.set_pixel(14, leg_y2, Color("4A3728"))
		img.set_pixel(15, leg_y2, Color("4A3728"))
		img.set_pixel(16, leg_y2, Color("4A3728"))
		img.set_pixel(17, leg_y2, Color("4A3728"))
	
	$SpriteBody.texture = ImageTexture.create_from_image(img)
	
	var armor_img = Image.create(32, 40, false, Image.FORMAT_RGBA8)
	armor_img.fill(Color(0,0,0,0))
	for x in range(10, 22):
		for y in range(10, 22):
			armor_img.set_pixel(x, y, armor_color)
	$SpriteArmor.texture = ImageTexture.create_from_image(armor_img)
	
	var weapon_img = Image.create(32, 40, false, Image.FORMAT_RGBA8)
	weapon_img.fill(Color(0,0,0,0))
	for y in range(12, 24):
		weapon_img.set_pixel(22, y, wpn_color)
		weapon_img.set_pixel(23, y, wpn_color)
	weapon_img.set_pixel(21, 11, Color("FFD700"))
	weapon_img.set_pixel(22, 11, Color("FFD700"))
	weapon_img.set_pixel(23, 11, Color("FFD700"))
	weapon_img.set_pixel(24, 11, Color("FFD700"))
	$SpriteWeapon.texture = ImageTexture.create_from_image(weapon_img)
	$SpriteWeapon.position.x = 8 if facing_right else -8

func _process(delta):
	$HPBar.max_value = GameData.player_max_hp
	$HPBar.value = GameData.player_hp
	
	if Input.is_action_just_pressed("attack"):
		attack()
	
	if Input.is_key_pressed(KEY_1):
		GameData.next_weapon()
		draw_player()
	if Input.is_key_pressed(KEY_2):
		GameData.next_armor()
		draw_player()

func attack():
	$AttackArea.position.x = 20 if facing_right else -20
	
	var bodies = $AttackArea.get_overlapping_bodies()
	for body in bodies:
		if body.has_method("hit"):
			body.hit(GameData.get_total_atk())
	
	var tween = create_tween()
	tween.tween_property($SpriteWeapon, "position:x", 12 if facing_right else -12, 0.1)
	tween.tween_property($SpriteWeapon, "position:x", 0, 0.1)

func hit(damage):
	var dead = GameData.take_damage(damage)
	var flash = create_tween()
	flash.tween_property($SpriteBody, "modulate", Color.RED, 0.1)
	flash.tween_property($SpriteBody, "modulate", Color.WHITE, 0.1)
	
	if dead:
		GameData.reset()
		position = Vector2(100, 100)
